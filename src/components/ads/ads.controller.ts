import {
  Controller,
  Get,
  QueryParam,
  Request,
  RouteMiddleware,
  RouteResponseBody,
  RouteSecurity,
  RouteTag,
} from "@amishfaldu/swagger-docs";
import { authMiddleware } from "../../common/middlewares/auth.middleware";
import { validationMiddleware } from "../../common/middlewares/validator.middleware";
import { AdsService } from "./ads.service";
import { InterstitialAdsResponseDto } from "./dto/interstitial-ads.dto";
import { SponsoredAdsResponseDto } from "./dto/sponsored-ads.dto";
import { validateGetInterstitialAdsRequest } from "./validations/get-interstitial-ads.validation";
import { validateGetSponsoredAdsRequest } from "./validations/get-sponsored-ads.validation";

@Controller({ route: "ads" })
@RouteTag("Ads")
@RouteMiddleware([authMiddleware])
export class AdsController {
  adsService: AdsService;
  constructor() {
    this.adsService = new AdsService();
  }

  @Get("interstitial-ads")
  @RouteMiddleware([
    (req, res, next) => {
      return validationMiddleware(
        req,
        res,
        next,
        validateGetInterstitialAdsRequest
      );
    },
  ])
  @RouteResponseBody(InterstitialAdsResponseDto, { isArray: true })
  @RouteSecurity([{ "Jwt Token": [] }])
  async getInterstitialAds(
    @Request() request: Express.Request & { id: string },
    @QueryParam("skip") skip: string,
    @QueryParam("limit") limit: string,
    @QueryParam("city") city?: string,
    @QueryParam("country") country?: string
  ): Promise<InterstitialAdsResponseDto[]> {
    const interstitialAds = await this.adsService.fetchInterstitialAds(
      request.id,
      city,
      country,
      { skip: parseInt(skip), limit: parseInt(limit) }
    );
    return interstitialAds;
  }

  @Get("sponsored-ads")
  @RouteMiddleware([
    (req, res, next) => {
      return validationMiddleware(
        req,
        res,
        next,
        validateGetSponsoredAdsRequest
      );
    },
  ])
  @RouteResponseBody(SponsoredAdsResponseDto, { isArray: true })
  @RouteSecurity([{ "Jwt Token": [] }])
  async getSponsoredAds(
    @Request() request: Express.Request & { id: string },
    @QueryParam("keywords") keywords: string,
    @QueryParam("skip") skip: string,
    @QueryParam("limit") limit: string
  ): Promise<SponsoredAdsResponseDto[]> {
    const sponsoredAds = await this.adsService.fetchSponsoredAds(
      JSON.parse(keywords),
      { skip: parseInt(skip), limit: parseInt(limit) }
    );
    return sponsoredAds;
  }
}
