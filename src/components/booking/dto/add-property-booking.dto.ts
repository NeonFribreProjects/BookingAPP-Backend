import { IsEnum, IsNumber, IsString } from "@amishfaldu/swagger-docs";
import { PropertyType } from "../../../components/user/validations/get-property.validation";

export class AddPropertyBookingDto {
  @IsString()
  stayStartDate: string;

  @IsString()
  stayEndDate: string;

  @IsString()
  propertyId?: string;

  @IsEnum(PropertyType)
  propertyType: PropertyType;
}

export class AddPropertyBookingResponseDto {
  @IsString()
  checkoutUrl: string;
}
