import {
  IsArray,
  IsEnum,
  IsNumber,
  IsObject,
  IsString,
} from "@amishfaldu/swagger-docs";
import { SponsoredAdGrade, SponsoredAdTargetedKeywords } from "@prisma/client";
import { AddLongStayPropertyResponseDto } from "../../../components/merchant/dto/add-long-stay-property.dto";

export class SponsoredAdsResponseDto {
  @IsString()
  id: string;

  @IsString()
  startDate: Date;

  @IsString()
  endDate: Date;

  @IsString()
  targetLocation: string;

  @IsArray("String", { isItemEnum: true })
  targetKeywords: SponsoredAdTargetedKeywords[];

  @IsEnum(SponsoredAdGrade)
  grade: SponsoredAdGrade;

  @IsNumber()
  views: number;

  @IsNumber()
  clicks: number;

  @IsNumber()
  conversions: number;

  @IsString()
  createdAt: Date;

  @IsString()
  updatedAt: Date;

  @IsObject()
  longStayProperty: AddLongStayPropertyResponseDto;
}
