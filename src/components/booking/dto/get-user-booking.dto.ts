import { IsNumber, IsString } from "@amishfaldu/swagger-docs";

export class GetUserBookingsDto {
  @IsString()
  id: string;

  @IsString()
  stayStartDate: Date;

  @IsString()
  stayEndDate: Date;

  @IsNumber()
  pricePerMonth: number;

  @IsNumber()
  totalPrice: number;

  @IsString()
  createdAt: Date;

  @IsString()
  updatedAt: Date;

  @IsString()
  longStayPropertyId?: string;

  @IsString()
  shortStayPropertyId?: string;

  @IsString()
  userId: string;
}
