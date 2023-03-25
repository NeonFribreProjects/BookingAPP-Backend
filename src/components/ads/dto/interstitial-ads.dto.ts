import { IsNumber, IsString } from "@amishfaldu/swagger-docs";

export class InterstitialAdsResponseDto {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  image: string;

  @IsString()
  link: string;

  @IsString()
  startDate: Date;

  @IsString()
  endDate: Date;

  @IsString()
  targetLocation: string;

  @IsString()
  targetSegment: string;

  @IsNumber()
  displayFrequency: number;

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
}
