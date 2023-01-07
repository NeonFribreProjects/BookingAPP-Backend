import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Request,
  RouteMiddleware,
  RouteRequestBody,
  RouteSecurity,
  RouteTag,
} from "@amishfaldu/swagger-docs";
import { Merchant } from "@prisma/client";
import { isUUID } from "class-validator";
import * as joi from "joi";
import { authMiddleware } from "../../common/middlewares/auth.middleware";
import { CustomHttpException } from "../../common/utils/custom-http-error";
import { LoginMerchantDto } from "./dto/login-merchant.dto";
import { RegisterMerchantDto } from "./dto/register-merchant.dto";
import { MerchantService } from "./merchant.service";

@Controller({ route: "merchant" })
@RouteTag("Merchant")
export class MerchantController {
  merchantService: MerchantService;
  constructor() {
    this.merchantService = new MerchantService();
  }

  @Post()
  async registerMerchant(
    @Body() registerDetails: RegisterMerchantDto
  ): Promise<{ token: string }> {
    if (
      joi.string().email().validate(registerDetails?.email).error ||
      joi.string().min(1).validate(registerDetails?.name).error ||
      joi.string().min(1).validate(registerDetails?.languagePreference).error ||
      joi.string().min(6).validate(registerDetails?.password).error
    ) {
      throw new CustomHttpException(400, "Invalid merchant details");
    }

    const registerResult = await this.merchantService.registerMerchant(
      registerDetails.email,
      registerDetails.name,
      registerDetails.languagePreference,
      registerDetails.password
    );
    return registerResult;
  }

  @Post("login")
  async loginMerchant(
    @Body() loginDetails: LoginMerchantDto
  ): Promise<{ token: string }> {
    if (
      joi.string().email().validate(loginDetails?.email).error ||
      joi.string().min(6).validate(loginDetails?.password).error
    ) {
      throw new CustomHttpException(400, "Invalid email or password");
    }

    const loginResult = await this.merchantService.loginMerchant(
      loginDetails.email,
      loginDetails.password
    );
    return loginResult;
  }

  @Patch()
  @RouteRequestBody(RegisterMerchantDto, { required: false })
  @RouteMiddleware([authMiddleware])
  @RouteSecurity([{ "Jwt Token": [] }])
  async updateMerchant(
    @Request() request: Express.Request & { id: string },
    @Body() merchantDetails: Partial<RegisterMerchantDto>
  ): Promise<Merchant> {
    if (!isUUID(request.id)) {
      throw new CustomHttpException(400, "Invalid merchant id");
    }

    const loginResult = await this.merchantService.updateMerchant(
      request.id,
      merchantDetails
    );
    return loginResult;
  }
}
