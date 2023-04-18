import { InterstitialAd, LongStayProperty, SponsoredAd } from "@prisma/client";
import dayjs from "dayjs";
import dayjsUtc from "dayjs/plugin/utc";

dayjs.extend(dayjsUtc);

import { prisma } from "../../common/utils/prisma";

export class AdsService {
  /**
   * Fetch interstitial ads
   * @param userId - user id
   * @param city - city for which to fetch interstitial ads
   * @param country - country for which to fetch interstitial ads
   * @returns interstitial ads
   */
  async fetchInterstitialAds(
    userId: string,
    city: string,
    country: string,
    paginationParams: { skip: number; limit: number }
  ): Promise<InterstitialAd[]> {
    let searchCity = city;
    let searchCountry = country;
    const currentDate = dayjs.utc().toISOString();
    if (!city && !country) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      searchCity = user.lastSearchedCity;
      searchCountry = user.lastSearchedCountry;
    }

    const interstitialAds = await prisma.interstitialAd.findMany({
      where: {
        OR: [
          {
            targetLocation: {
              contains: searchCity,
              mode: "insensitive",
            },
          },
          {
            targetLocation: {
              contains: searchCountry,
              mode: "insensitive",
            },
          },
        ],
        startDate: { lte: currentDate },
        endDate: { gte: currentDate },
      },
      take: paginationParams.limit,
      skip: paginationParams.skip,
    });

    return interstitialAds;
  }

  /**
   * Fetch sponsored ads
   * @param keywords - keywords with values that should be used to target ads
   * @param paginationParams - pagination parameters
   * @returns interstitial ads
   */
  async fetchSponsoredAds(
    keywords: { [key: string]: any },
    paginationParams: { skip: number; limit: number }
  ): Promise<
    (SponsoredAd & {
      longStayProperty: LongStayProperty;
    })[]
  > {
    const currentDate = dayjs.utc().toISOString();
    const sponsoredAds = await prisma.sponsoredAd.findMany({
      where: {
        startDate: { lte: currentDate },
        endDate: { gte: currentDate },
        targetKeywords: Object.keys(keywords).length
          ? {
              hasSome: Object.keys(keywords) as any[],
            }
          : undefined,
      },
      orderBy: { grade: "asc" },
      take: paginationParams.limit,
      skip: paginationParams.skip,
    });

    console.log("Sponsored ads: ", sponsoredAds);
    const adsToShow = await Promise.all(
      sponsoredAds.map((sponsoredAd) => {
        const longStayPropertyParams = sponsoredAd.targetKeywords.reduce(
          (properties, keyword) => {
            if (
              keywords[keyword] !== undefined ||
              (Array.isArray(keywords[keyword]) && !keywords[keyword]?.length)
            ) {
              return properties;
            }

            properties.OR.push({ [keyword]: keywords[keyword] });
            if (keyword === "amenities" || keyword === "availableFacilities") {
              properties.OR.push({
                [keyword]: { hasSome: keywords[keyword] },
              });
            }
            return properties;
          },
          { OR: [] }
        );
        console.log("Property filter: ",sponsoredAd.targetKeywords, longStayPropertyParams);

        return prisma.sponsoredAd.findFirst({
          where: {
            id: sponsoredAd.id,
            longStayProperty: longStayPropertyParams,
          },
          include: {
            longStayProperty: true,
          },
        });
      })
    );
    return adsToShow.filter((ad) => ad);
  }
}
