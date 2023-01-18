import {
  Body,
  Controller,
  Get,
  Post,
  QueryParam,
  Request,
  RouteMiddleware,
  RouteResponseBody,
  RouteSecurity,
  RouteTag,
} from "@amishfaldu/swagger-docs";
import { authMiddleware } from "../../common/middlewares/auth.middleware";
import { validationMiddleware } from "../../common/middlewares/validator.middleware";
import {
  AddLongStayPropertyDto,
  AddLongStayPropertyResponseDto,
} from "../merchant/dto/add-long-stay-property.dto";
import {
  AddShortStayPropertyDto,
  AddShortStayPropertyResponseDto,
} from "../merchant/dto/add-short-stay-property.dto";
import { LoginUserDto, LoginUserResponseDto } from "./dto/login-user.dto";
import {
  RegisterUserDto,
  RegisterUserResponseDto,
} from "./dto/register-user.dto";
import { UserService } from "./user.service";
import { validateGetPropertyRequest } from "./validations/get-property.validation";
import { validateLoginRequest } from "./validations/login-user.validation";
import { validateRegisterRequest } from "./validations/register-user.validation";

@Controller({ route: "user" })
@RouteTag("User")
export class UserController {
  userService: UserService;
  constructor() {
    this.userService = new UserService();
  }

  @Post()
  @RouteMiddleware([
    (req, res, next) => {
      return validationMiddleware(req, res, next, validateRegisterRequest);
    },
  ])
  @RouteResponseBody(RegisterUserResponseDto)
  async registerUser(
    @Body() registerDetails: RegisterUserDto
  ): Promise<RegisterUserResponseDto> {
    const registerResult = await this.userService.registerUser(registerDetails);
    return registerResult;
  }

  @Post("login")
  @RouteMiddleware([
    (req, res, next) => {
      return validationMiddleware(req, res, next, validateLoginRequest);
    },
  ])
  @RouteResponseBody(LoginUserResponseDto)
  async loginUser(
    @Body() loginDetails: LoginUserDto
  ): Promise<LoginUserResponseDto> {
    const loginResult = await this.userService.loginUser(
      loginDetails.email,
      loginDetails.password
    );
    return loginResult;
  }

  @Get("search")
  @RouteMiddleware([
    authMiddleware,
    (req, res, next) => {
      return validationMiddleware(req, res, next, validateGetPropertyRequest);
    },
  ])
  @RouteResponseBody(
    AddLongStayPropertyResponseDto || AddShortStayPropertyResponseDto,
    {
      isArray: true,
    }
  )
  @RouteSecurity([{ "Jwt Token": [] }])
  async getProperty(
    @Request() request: Express.Request & { id: string },
    @QueryParam("skip") skip: string,
    @QueryParam("limit") limit: string,
    @QueryParam("propertyType") propertyType?: "ShortStay" | "LongStay",
    @QueryParam("startDate") startDate?: string,
    @QueryParam("endDate") endDate?: string,

    @QueryParam("rooms") rooms?: string,
    @QueryParam("guests") guests?: string,
    @QueryParam("children") children?: string,

    @QueryParam("minPrice") minPrice?: string,
    @QueryParam("maxPrice") maxPrice?: string,

    @QueryParam("facilities") facilities?: string,
    @QueryParam("amenities") amenities?: string,
    @QueryParam("bedPreference") bedPreference?: string,
    @QueryParam("star") star?: string,
    @QueryParam("reviewScore") reviewScore?: string,

    @QueryParam("city") city?: string,
    @QueryParam("country") country?: string
  ): Promise<AddLongStayPropertyDto[] | AddShortStayPropertyDto[]> {
    const property = await this.userService.getProperty(
      request.id,
      {
        propertyType,
        startDate,
        endDate,
        rooms: parseInt(rooms),
        guests: parseInt(guests),
        children: Boolean(children),
        minPrice: parseInt(minPrice),
        maxPrice: parseInt(maxPrice),
        facilities,
        amenities,
        bedPreference,
        star: parseFloat(star),
        reviewScore: parseFloat(reviewScore),
        city,
        country,
      },
      { skip: parseInt(skip), limit: parseInt(limit) }
    );
    return property;
  }
}
