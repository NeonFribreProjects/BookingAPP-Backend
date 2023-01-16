import { IsNumber, IsString, isUUID, validate } from "class-validator";
import { Request } from "express";
import { CustomHttpException } from "../../../common/utils/custom-http-error";
import { plainToInstance } from "class-transformer";

class GetInterstitialAdsRequest {
  @IsNumber()
  skip: number;

  @IsNumber()
  limit: number;

  @IsString()
  city: string;

  @IsString()
  country: string;
}

export async function validateGetInterstitialAdsRequest(
  req: Request & { id?: string }
) {
  if (!isUUID(req?.id)) {
    throw new CustomHttpException(400, "Invalid user id");
  }

  const body = req.body;
  if (!body) {
    throw new CustomHttpException(400, "Invalid data");
  }

  const adsBody = plainToInstance(GetInterstitialAdsRequest, req.query);
  const errors = await validate(adsBody, { forbidNonWhitelisted: true });

  const errorMessages = {};
  errors.forEach((error) => {
    errorMessages[error.property] = Object.values(error.constraints);
  });

  if (errors.length > 0) {
    throw new CustomHttpException(400, "Invalid data", errorMessages);
  }
}
