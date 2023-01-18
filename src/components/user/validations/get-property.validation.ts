import { ShortStayPropertyBedOptions } from "@prisma/client";
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  isUUID,
} from "class-validator";
import { Request } from "express";
import { CustomHttpException } from "../../../common/utils/custom-http-error";

export enum PropertyType {
  LONG_STAY = "longStay",
  SHORT_STAY = "shortStay",
}

class GetPropertyValidation {
  @IsEnum(PropertyType)
  @IsOptional()
  propertyType: PropertyType;

  @IsDateString()
  @IsOptional()
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate: string;

  @IsNumber()
  @IsOptional()
  rooms: number;

  @IsNumber()
  @IsOptional()
  guests: number;

  @IsBoolean()
  @IsOptional()
  children: boolean;

  @IsNumber()
  @IsOptional()
  minPrice: number;

  @IsNumber()
  @IsOptional()
  maxPrice: number;

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

  @IsNumber()
  @IsOptional()
  star: number;

  @IsNumber()
  @IsOptional()
  reviewScore: number;

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
}
