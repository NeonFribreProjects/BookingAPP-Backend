import { Gender, SmokingPreference } from "@prisma/client";
import { plainToInstance } from "class-transformer";
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsOptional,
  IsString,
  validate,
} from "class-validator";
import { Request } from "express";
import { CustomHttpException } from "../../../common/utils/custom-http-error";

export class RegisterUserDtoValidation {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  languagePreference: string;

  @IsString()
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsMobilePhone()
  mobileNumber: string;

  @IsDateString()
  @IsOptional()
  dob?: string;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsEnum(SmokingPreference)
  @IsOptional()
  smokingPreference?: SmokingPreference;

  @IsString()
  @IsOptional()
  address?: string;
}

export async function validateRegisterRequest(req: Request) {
  const body = req.body;
  if (!body) {
    throw new CustomHttpException(400, "Invalid data");
  }

  const registerBody = plainToInstance(RegisterUserDtoValidation, body);
  const errors = await validate(registerBody, { forbidNonWhitelisted: true });

  const errorMessages = {};
  errors.forEach((error) => {
    errorMessages[error.property] = Object.values(error.constraints);
  });

  if (errors.length > 0) {
    throw new CustomHttpException(400, "Invalid data", errorMessages);
  }
}
