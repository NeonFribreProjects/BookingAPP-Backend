import { plainToInstance } from "class-transformer";
import { IsEmail, IsString, validate } from "class-validator";
import { Request } from "express";
import { CustomHttpException } from "../../../common/utils/custom-http-error";

export class LoginUserDtoValidation {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export async function validateLoginRequest(req: Request) {
  const body = req.body;
  if (!body) {
    throw new CustomHttpException(400, "Invalid data");
  }

  const registerBody = plainToInstance(LoginUserDtoValidation, body);
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
