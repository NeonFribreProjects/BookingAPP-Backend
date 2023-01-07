import { IsString } from "@amishfaldu/swagger-docs";

export class RegisterMerchantDto {
  @IsString()
  email: string;

  @IsString()
  name: string;

  @IsString()
  languagePreference: string;

  @IsString()
  password: string;
}
