import { plainToInstance } from "class-transformer";
import { IsEmail, IsString, validate } from "class-validator";
import { Request } from "express";
import { CustomHttpException } from "../../../common/utils/custom-http-error";

export class RegisterMerchantDtoValidation {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  languagePreference: string;

  @IsString()
  password: string;
}

export async function validateRegisterRequest(req: Request) {
  const body = req.body;
  if (!body) {
    throw new CustomHttpException(400, "Invalid data");
  }

  const registerBody = plainToInstance(RegisterMerchantDtoValidation, body);
  const errors = await validate(registerBody, { forbidNonWhitelisted: true });

  const errorMessages = {};
  errors.forEach((error) => {
    errorMessages[error.property] = Object.values(error.constraints);
  });

  if (errors.length > 0) {
    throw new CustomHttpException(400, "Invalid data", errorMessages);
  }
}
