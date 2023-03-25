import { IsString } from "@amishfaldu/swagger-docs";

export class GetPresignedURLResponseDto {
  @IsString()
  url: string;
}
