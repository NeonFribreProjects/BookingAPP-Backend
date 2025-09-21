import { IsEnum, IsString, IsOptional } from "class-validator";
//import { IsEnum, IsString } from "@amishfaldu/swagger-docs";
import { Gender, SmokingPreference } from "@prisma/client";

export class RegisterUserDto {
  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  mobileNumber: string;


// Optional fields
  dob?: string;
  gender?: Gender;
  smokingPreference?: SmokingPreference;
  address?: string;
}

export class RegisterUserResponseDto {
  @IsString()
  token: string;
}
