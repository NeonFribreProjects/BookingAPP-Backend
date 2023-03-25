import { IsString } from "@amishfaldu/swagger-docs";

export class LoginUserDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}

export class LoginUserResponseDto {
  @IsString()
  token: string;
}
