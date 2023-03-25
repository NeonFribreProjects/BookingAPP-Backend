import { IsString } from "@amishfaldu/swagger-docs";

export class LoginMerchantDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}

export class LoginMerchantResponseDto {
  @IsString()
  token: string;
}
