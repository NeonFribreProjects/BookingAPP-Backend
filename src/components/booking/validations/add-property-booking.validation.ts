import { plainToInstance } from "class-transformer";
import {
  IsDateString,
  IsEnum,
  IsString,
  MinDate,
  ValidateIf,
  isUUID,
  validate,
} from "class-validator";
import dayjs from "dayjs";
import { Request } from "express";
import { CustomHttpException } from "../../../common/utils/custom-http-error";
import { PropertyType } from "../../../components/user/validations/get-property.validation";
import { AddPropertyBookingDto } from "../dto/add-property-booking.dto";

class PropertyBookingDtoValidation {
  @IsDateString()
  @MinDate(() =>
    dayjs()
      .set("hours", 0)
      .set("minutes", 0)
      .set("seconds", 0)
      .set("milliseconds", 0)
      .toDate()
  )
  stayStartDate: string;

  @IsDateString()
  @MinDate(() =>
    dayjs()
      .add(1, "day")
      .set("hours", 0)
      .set("minutes", 0)
      .set("seconds", 0)
      .set("milliseconds", 0)
      .toDate()
  )
  @ValidateIf((body: AddPropertyBookingDto) =>
    dayjs(body.stayEndDate)
      .set("hours", 0)
      .set("minutes", 0)
      .set("seconds", 0)
      .set("milliseconds", 0)
      .isAfter(
        dayjs(body.stayStartDate)
          .set("hours", 0)
          .set("minutes", 0)
          .set("seconds", 0)
          .set("milliseconds", 0)
      )
  )
  stayEndDate: string;

  @IsString()
  propertyId?: string;

  @IsEnum(PropertyType)
  propertyType: PropertyType;
}

export async function validateAddPropertyBookingRequest(
  req: Request & { id?: string }
) {
  if (!isUUID(req?.id)) {
    throw new CustomHttpException(400, "Invalid user id");
  }

  const body = req.body;
  if (!body) {
    throw new CustomHttpException(400, "Invalid data");
  }

  const propertyBody = plainToInstance(PropertyBookingDtoValidation, body);
  const errors = await validate(propertyBody, { forbidNonWhitelisted: true });

  const errorMessages = {};
  errors.forEach((error) => {
    errorMessages[error.property] = Object.values(error.constraints);
  });

  if (errors.length > 0) {
    throw new CustomHttpException(400, "Invalid data", errorMessages);
  }
}
