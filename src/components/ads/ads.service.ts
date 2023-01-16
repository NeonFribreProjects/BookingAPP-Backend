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
            },
          },
          {
            targetLocation: {
              contains: searchCountry,
            },
          },
        ],
        startDate: { gte: currentDate },
        endDate: { lte: currentDate },
      },
      take: paginationParams.limit,
      skip: paginationParams.skip,
    });

    return interstitialAds;
  }

  /**
   * Fetch interstitial ads
   * @param city - city for which to fetch interstitial ads
   * @param country - country for which to fetch interstitial ads
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
        startDate: { gte: currentDate },
        endDate: { lte: currentDate },
        targetKeywords: {
          hasSome: Object.keys(keywords) as any[],
        },
      },
      take: paginationParams.limit,
      skip: paginationParams.skip,
    });

    const adsToShow = await Promise.all(
      sponsoredAds.map((sponsoredAd) =>
        prisma.sponsoredAd.findFirst({
          where: {
            id: sponsoredAd.id,
            longStayProperty: sponsoredAd.targetKeywords.reduce(
              (properties, keyword) => {
                properties[keyword] = keywords[keyword];
                return properties;
              },
              {}
            ),
          },
          include: {
            longStayProperty: true,
          },
        })
      )
    );
    return adsToShow;
  }
}
