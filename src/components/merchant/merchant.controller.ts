import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  QueryParam,
  Request,
  RouteMiddleware,
  RouteRequestBody,
  RouteResponseBody,
  RouteSecurity,
  RouteTag,
} from "@amishfaldu/swagger-docs";
import { isUUID } from "class-validator";
import { authMiddleware } from "../../common/middlewares/auth.middleware";
import { validationMiddleware } from "../../common/middlewares/validator.middleware";
import { CustomHttpException } from "../../common/utils/custom-http-error";
import { GetUserBookingsDto } from "../booking/dto/get-user-booking.dto";
import {
  AddLongStayPropertyDto,
  AddLongStayPropertyResponseDto,
} from "./dto/add-long-stay-property.dto";
import {
  AddShortStayPropertyDto,
  AddShortStayPropertyResponseDto,
} from "./dto/add-short-stay-property.dto";
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
import { validateGetPropertyRequest } from "./validations/get-property.validation";
import { validateLoginRequest } from "./validations/login-merchant.validation";
import { validateAddLongStayPropertyRequest } from "./validations/long-stay-property.validation";
import { validateRegisterRequest } from "./validations/register-merchant.validation";
import { validateAddShortStayPropertyRequest } from "./validations/short-stay-property.validation";
import { validateUpdateMerchantRequest } from "./validations/update-merchant.validation";

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
    const loginResult = await this.merchantService.loginMerchant(
      loginDetails.email,
      loginDetails.password
    );
    return loginResult;
  }

  @Patch()
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
  @RouteRequestBody(UpdateMerchantDto, { required: false })
  @RouteResponseBody(UpdateMerchantResponseDto)
  @RouteSecurity([{ "Jwt Token": [] }])
  async updateMerchant(
    @Request() request: Express.Request & { id: string },
    @Body() merchantDetails: Partial<UpdateMerchantDto>
  ): Promise<UpdateMerchantResponseDto> {
    const loginResult = await this.merchantService.updateMerchant(
      request.id,
      merchantDetails
    );
    return loginResult;
  }

  @Post("short-stay-property")
  @RouteMiddleware([
    authMiddleware,
    (req, res, next) => {
      return validationMiddleware(
        req,
        res,
        next,
        validateAddShortStayPropertyRequest
      );
    },
  ])
  @RouteRequestBody(AddShortStayPropertyDto)
  @RouteResponseBody(AddShortStayPropertyResponseDto)
  @RouteSecurity([{ "Jwt Token": [] }])
  async addShortStayProperty(
    @Request() request: Express.Request & { id: string },
    @Body() shortStayPropertyDetails: AddShortStayPropertyDto
  ): Promise<AddShortStayPropertyResponseDto> {
    const property = await this.merchantService.addShortStayProperty(
      request.id,
      shortStayPropertyDetails
    );
    return property;
  }

  @Post("long-stay-property")
  @RouteMiddleware([
    authMiddleware,
    (req, res, next) => {
      return validationMiddleware(
        req,
        res,
        next,
        validateAddLongStayPropertyRequest
      );
    },
  ])
  @RouteRequestBody(AddLongStayPropertyDto)
  @RouteResponseBody(AddLongStayPropertyResponseDto)
  @RouteSecurity([{ "Jwt Token": [] }])
  async addLongStayProperty(
    @Request() request: Express.Request & { id: string },
    @Body() longStayPropertyDetails: AddLongStayPropertyDto
  ): Promise<AddLongStayPropertyResponseDto> {
    const property = await this.merchantService.addLongStayProperty(
      request.id,
      longStayPropertyDetails
    );
    return property;
  }

  @Get("property")
  @RouteMiddleware([
    authMiddleware,
    (req, res, next) => {
      return validationMiddleware(req, res, next, validateGetPropertyRequest);
    },
  ])
  @RouteResponseBody(AddLongStayPropertyDto || AddShortStayPropertyDto, {
    isArray: true,
  })
  @RouteSecurity([{ "Jwt Token": [] }])
  async getProperty(
    @Request() request: Express.Request & { id: string },
    @QueryParam("propertyType") propertyType: "ShortStay" | "LongStay"
  ): Promise<AddLongStayPropertyDto[] | AddShortStayPropertyDto[]> {
    const property = await this.merchantService.getProperty(
      request.id,
      propertyType
    );
    return property;
  }

  @Get("booking")
  @RouteMiddleware([authMiddleware])
  @RouteResponseBody(GetUserBookingsDto, {
    isArray: true,
  })
  @RouteSecurity([{ "Jwt Token": [] }])
  async getBookings(
    @Request() request: Express.Request & { id: string }
  ): Promise<GetUserBookingsDto[]> {
    if (!isUUID(request.id)) {
      throw new CustomHttpException(400, "Invalid merchant id");
    }

    const bookings = await this.merchantService.getBookings(request.id);
    return bookings;
  }
}
