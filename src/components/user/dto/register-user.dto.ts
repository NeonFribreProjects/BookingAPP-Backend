import { IsEnum, IsString } from "@amishfaldu/swagger-docs";
import { Gender, SmokingPreference } from "@prisma/client";

export class RegisterUserDto {
  @IsString()
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

  @IsString()
  mobileNumber: string;

  @IsString()
  dob?: string;

  @IsEnum(Gender)
  gender?: Gender;

  @IsEnum(SmokingPreference)
  smokingPreference?: SmokingPreference;

  @IsString()
  address?: string;

  @IsString()
  creditCard?: string;
}

export class RegisterUserResponseDto {
  @IsString()
  token: string;
}
