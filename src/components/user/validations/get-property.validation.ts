import { ShortStayPropertyBedOptions } from "@prisma/client";
import { plainToInstance } from "class-transformer";
import {
  IsBooleanString,
  IsDateString,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  isUUID,
  validate,
} from "class-validator";
import { Request } from "express";
import { CustomHttpException } from "../../../common/utils/custom-http-error";

export enum PropertyType {
  LONG_STAY = "longStay",
  SHORT_STAY = "shortStay",
}

class GetPropertyValidation {
  @IsNumberString()
  skip: string;

  @IsNumberString()
  limit: string;

  @IsEnum(PropertyType)
  @IsOptional()
  propertyType: PropertyType;

  @IsDateString()
  @IsOptional()
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate: string;

  @IsNumberString()
  @IsOptional()
  rooms: string;

  @IsNumberString()
  @IsOptional()
  guests: string;

  @IsBooleanString()
  @IsOptional()
  children: string;

  @IsNumberString()
  @IsOptional()
  minPrice: string;

  @IsNumberString()
  @IsOptional()
  maxPrice: string;

  // comma separated facilities
  @IsString()
  @IsOptional()
  facilities: string;

  // comma separated amenities
  @IsString()
  @IsOptional()
  amenities: string;

  @IsEnum(ShortStayPropertyBedOptions)
  @IsOptional()
  bedPreference: ShortStayPropertyBedOptions;

  @IsNumberString()
  @IsOptional()
  star: string;

  @IsNumberString()
  @IsOptional()
  reviewScore: string;

  @IsString()
  @IsOptional()
  city: string;

  @IsString()
  @IsOptional()
  country: string;
}

export async function validateGetPropertyRequest(
  req: Request & { id: string }
) {
  if (!isUUID(req.id)) {
    throw new CustomHttpException(400, "Invalid user id");
  }

  const query = req.query;
  const registerBody = plainToInstance(GetPropertyValidation, query);
  const errors = await validate(registerBody, {
    forbidNonWhitelisted: true,
  });

  const errorMessages = {};
  errors.forEach((error) => {
    errorMessages[error.property] = Object.values(error.constraints);
  });

  if (errors.length > 0) {
    throw new CustomHttpException(400, "Invalid data", errorMessages);
  }
}
