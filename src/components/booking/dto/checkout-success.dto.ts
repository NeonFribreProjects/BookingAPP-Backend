import { IsBoolean, IsString } from "@amishfaldu/swagger-docs";

export class CheckoutSuccessDto {
  @IsString()
  sessionId: string;
}

export class CheckoutSuccessResponseDto {
  @IsBoolean()
  success: boolean;
}
