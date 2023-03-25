import {
  Controller,
  Get,
  QueryParam,
  RouteMiddleware,
  RouteResponseBody,
  RouteSecurity,
  RouteTag,
} from "@amishfaldu/swagger-docs";
import { authMiddleware } from "../../common/middlewares/auth.middleware";
import { AWSService } from "./aws.service";
import { GetPresignedURLResponseDto } from "./dto/get-presigned-url.dto";

@Controller({ route: "aws" })
@RouteTag("AWS")
export class AWSController {
  awsService: AWSService;
  constructor() {
    this.awsService = new AWSService();
  }

  @Get("presigned-s3-url")
  @RouteMiddleware([authMiddleware])
  @RouteResponseBody(GetPresignedURLResponseDto)
  @RouteSecurity([{ "Jwt Token": [] }])
  async getPresignedUrl(
    @QueryParam("key") key: string
  ): Promise<GetPresignedURLResponseDto> {
    const presignedURLResponse = await this.awsService.getPreSignedURL(key);
    return presignedURLResponse;
  }
}
