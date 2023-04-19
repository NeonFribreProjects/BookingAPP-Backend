import {
  IsNumber,
  IsNumberString,
  IsObject,
  IsString,
  isUUID,
  validate,
} from "class-validator";
import { Request } from "express";
import { CustomHttpException } from "../../../common/utils/custom-http-error";
import { plainToInstance } from "class-transformer";
import { SponsoredAdTargetedKeywords } from "@prisma/client";

class GetSponsoredAdsRequest {
  @IsNumberString()
  skip: string;

  @IsNumberString()
  limit: string;

  @IsString()
  keywords: string;
}

export async function validateGetSponsoredAdsRequest(
  req: Request & { id?: string }
) {
  if (!isUUID(req?.id)) {
    throw new CustomHttpException(400, "Invalid user id");
  }

  const body = req.body;
  if (!body) {
    throw new CustomHttpException(400, "Invalid data");
  }

  const adsBody = plainToInstance(GetSponsoredAdsRequest, req.query);
  const errors = await validate(adsBody, { forbidNonWhitelisted: true });

  const errorMessages = {};
  errors.forEach((error) => {
    errorMessages[error.property] = Object.values(error.constraints);
  });

  if (errors.length > 0) {
    throw new CustomHttpException(400, "Invalid data", errorMessages);
  }
}
