import {
  AvailableFacilities,
  ShortStayAmenities,
  ShortStayBreakfastOptions,
  ShortStayCancellation,
  ShortStayCancellationFine,
  ShortStayPropertyBedOptions,
  ShortStayPropertyType,
  SmokingPolicy,
} from "@prisma/client";
import { plainToInstance } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  isUUID,
  validate,
} from "class-validator";
import { Request } from "express";
import { CustomHttpException } from "../../../common/utils/custom-http-error";

class ShortStayPropertyDtoValidation {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsEnum(ShortStayPropertyType)
  propertyType: ShortStayPropertyType;

  @IsNumber()
  @IsOptional()
  starRating: number | null;

  @IsString()
  streetAddress: string;

  @IsString()
  @IsOptional()
  addressLine2: string | null;

  @IsString()
  country: string;

  @IsString()
  city: string;

  @IsString()
  postCode: string;

  @IsString()
  contactName: string;

  @IsString()
  contactPhoneNumber: string;

  @IsString()
  @IsOptional()
  contactAlternativePhoneNumber: string | null;

  @IsString()
  roomName: string;

  @IsString()
  customName: string;

  @IsString()
  roomType: string;

  @IsEnum(SmokingPolicy)
  smokingPolicy: SmokingPolicy;

  @IsNumber()
  numberOfRooms: number;

  @IsEnum(ShortStayPropertyBedOptions)
  bedOptions: ShortStayPropertyBedOptions;

  @IsNumber()
  numberOfGuestsAllowed: number;

  @IsNumber()
  roomSize: number;

  @IsBoolean()
  parking: boolean;

  @IsEnum(ShortStayBreakfastOptions)
  breakfast: ShortStayBreakfastOptions;

  @IsArray()
  @IsString({ each: true })
  languagesSpoken: string[];

  @IsArray()
  @IsEnum(AvailableFacilities, { each: true })
  availableFacilities: AvailableFacilities[];

  @IsBoolean()
  extraBedOption: boolean;

  @IsArray()
  @IsEnum(ShortStayAmenities, { each: true })
  amenities: ShortStayAmenities[];

  @IsArray()
  @IsString({ each: true })
  pictures: string[];

  @IsString()
  checkInTime: string;

  @IsString()
  checkOutTime: string;

  @IsBoolean()
  children: boolean;

  @IsBoolean()
  pets: boolean;

  @IsBoolean()
  creditCard: boolean;

  @IsNumber()
  commissionPercentage: number;

  @IsNumber()
  pricePerPerson: number;

  @IsEnum(ShortStayCancellation)
  cancellation: ShortStayCancellation;

  @IsEnum(ShortStayCancellationFine)
  cancellationFine: ShortStayCancellationFine;
}

export async function validateAddShortStayPropertyRequest(
  req: Request & { id?: string }
) {
  if (!isUUID(req?.id)) {
    throw new CustomHttpException(400, "Invalid merchant id");
  }

  const body = req.body;
  if (!body) {
    throw new CustomHttpException(400, "Invalid data");
  }

  const propertyBody = plainToInstance(ShortStayPropertyDtoValidation, body);
  const errors = await validate(propertyBody, { forbidNonWhitelisted: true });

  const errorMessages = {};
  errors.forEach((error) => {
    errorMessages[error.property] = Object.values(error.constraints);
  });

  if (errors.length > 0) {
    throw new CustomHttpException(400, "Invalid data", errorMessages);
  }
}
