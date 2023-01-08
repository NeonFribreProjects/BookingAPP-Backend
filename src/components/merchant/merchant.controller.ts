import {
  Body,
  Controller,
  Patch,
  Post,
  Request,
  RouteMiddleware,
  RouteRequestBody,
  RouteResponseBody,
  RouteSecurity,
  RouteTag,
} from "@amishfaldu/swagger-docs";
import { isUUID } from "class-validator";
import * as joi from "joi";
import { authMiddleware } from "../../common/middlewares/auth.middleware";
import { validationMiddleware } from "../../common/middlewares/validator.middleware";
import { CustomHttpException } from "../../common/utils/custom-http-error";
import {
  LoginMerchantDto,
  LoginMerchantResponseDto,
} from "./dto/login-merchant.dto";
import {
  RegisterMerchantDto,
  RegisterMerchantResponseDto,
} from "./dto/register-merchant.dto";
import {
  UpdateMerchantDto,
  UpdateMerchantResponseDto,
} from "./dto/update-merchant.dto";
import { MerchantService } from "./merchant.service";
import { validateLoginRequest } from "./validations/login-merchant.validation";
import { validateRegisterRequest } from "./validations/register-merchant.validation";
import { validateUpdateMerchantRequest } from "./validations/update-merchant.validation";
import { AddShortStayPropertyDto } from "./dto/add-short-stay-property.dto";

@Controller({ route: "merchant" })
@RouteTag("Merchant")
export class MerchantController {
  merchantService: MerchantService;
  constructor() {
    this.merchantService = new MerchantService();
  }

  @Post()
  @RouteMiddleware([
    (req, res, next) => {
      return validationMiddleware(req, res, next, validateRegisterRequest);
    },
  ])
  @RouteResponseBody(LoginMerchantResponseDto)
  async registerMerchant(
    @Body() registerDetails: RegisterMerchantDto
  ): Promise<RegisterMerchantResponseDto> {
    const registerResult = await this.merchantService.registerMerchant(
      registerDetails.email,
      registerDetails.name,
      registerDetails.languagePreference,
      registerDetails.password
    );
    return registerResult;
  }

  @Post("login")
  @RouteMiddleware([
    (req, res, next) => {
      return validationMiddleware(req, res, next, validateLoginRequest);
    },
  ])
  @RouteResponseBody(LoginMerchantResponseDto)
  async loginMerchant(
    @Body() loginDetails: LoginMerchantDto
  ): Promise<LoginMerchantResponseDto> {
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
  @RouteRequestBody(UpdateMerchantDto, { required: false })
  @RouteMiddleware([
    authMiddleware,
    (req, res, next) => {
      return validationMiddleware(
        req,
        res,
        next,
        validateUpdateMerchantRequest
      );
    },
  ])
  @RouteResponseBody(UpdateMerchantResponseDto)
  @RouteSecurity([{ "Jwt Token": [] }])
  async updateMerchant(
    @Request() request: Express.Request & { id: string },
    @Body() merchantDetails: Partial<UpdateMerchantDto>
  ): Promise<UpdateMerchantResponseDto> {
    if (!isUUID(request.id)) {
      throw new CustomHttpException(400, "Invalid merchant id");
    }

    const loginResult = await this.merchantService.updateMerchant(
      request.id,
      merchantDetails
    );
    return loginResult;
  }

  @Post("short-stay-property")
  @RouteRequestBody(AddShortStayPropertyDto)
  @RouteMiddleware([
    authMiddleware,
    (req, res, next) => {
      return validationMiddleware(
        req,
        res,
        next,
        validateUpdateMerchantRequest
      );
    },
  ])
  @RouteResponseBody(AddShortStayPropertyDto)
  @RouteSecurity([{ "Jwt Token": [] }])
  async addShortStayProperty(
    @Request() request: Express.Request & { id: string },
    @Body() shortStayPropertyDetails: AddShortStayPropertyDto
  ): Promise<AddShortStayPropertyDto> {
    if (!isUUID(request.id)) {
      throw new CustomHttpException(400, "Invalid merchant id");
    }

    const property = await this.merchantService.addShortStayProperty(
      request.id,
      shortStayPropertyDetails
    );
    return property;
  }
}
