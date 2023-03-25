import { IsString } from "@amishfaldu/swagger-docs";
import { RegisterMerchantDto } from "./register-merchant.dto";

export class UpdateMerchantDto extends RegisterMerchantDto {}

export class UpdateMerchantResponseDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  languagePreference: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  createdAt: Date;

  @IsString()
  updatedAt: Date;
}
