import {
  AvailableFacilities,
  LongStayAmenities,
  LongStayPropertyAvailability,
  LongStayPropertyLeaseOptions,
  LongStayPropertyRoomType,
  LongStayPropertyType,
  ShortStayCancellation,
  ShortStayCancellationFine,
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

class LongStayPropertyDtoValidation {
  @IsString()
  description: string;

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

  @IsEnum(LongStayPropertyType)
  propertyType: LongStayPropertyType;

  @IsNumber()
  numberOfRooms: number;

  @IsEnum(LongStayPropertyRoomType)
  roomType: LongStayPropertyRoomType;

  @IsNumber()
  numberOfBathrooms: number;

  @IsEnum(LongStayPropertyAvailability)
  availability: LongStayPropertyAvailability;

  @IsBoolean()
  furnished: boolean;

  @IsEnum(LongStayPropertyLeaseOptions)
  lease: LongStayPropertyLeaseOptions;

  @IsArray()
  @IsString({ each: true })
  pictures: string[];

  @IsBoolean()
  parking: boolean;

  @IsArray()
  @IsEnum(AvailableFacilities, { each: true })
  availableFacilities: AvailableFacilities[];

  @IsArray()
  @IsEnum(LongStayAmenities, { each: true })
  amenities: LongStayAmenities[];

  @IsNumber()
  pricePerMonth: number;

  @IsEnum(ShortStayCancellation)
  cancellation: ShortStayCancellation;

  @IsEnum(ShortStayCancellationFine)
  cancellationFine: ShortStayCancellationFine;
}

export async function validateAddLongStayPropertyRequest(
  req: Request & { id?: string }
) {
  if (!isUUID(req?.id)) {
    throw new CustomHttpException(400, "Invalid merchant id");
  }

  const body = req.body;
  if (!body) {
    throw new CustomHttpException(400, "Invalid data");
  }

  const propertyBody = plainToInstance(LongStayPropertyDtoValidation, body);
  const errors = await validate(propertyBody, { forbidNonWhitelisted: true });

  const errorMessages = {};
  errors.forEach((error) => {
    errorMessages[error.property] = Object.values(error.constraints);
  });

  if (errors.length > 0) {
    throw new CustomHttpException(400, "Invalid data", errorMessages);
  }
}
