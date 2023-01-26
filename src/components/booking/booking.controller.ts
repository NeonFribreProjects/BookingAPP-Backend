import {
  Body,
  Controller,
  Get,
  PathParam,
  Post,
  Put,
  Request,
  Response,
  RouteMiddleware,
  RouteRequestBody,
  RouteResponseBody,
  RouteSecurity,
  RouteTag,
} from "@amishfaldu/swagger-docs";
import * as express from "express";
import { authMiddleware } from "src/common/middlewares/auth.middleware";
import { validationMiddleware } from "../../common/middlewares/validator.middleware";
import { BookingService } from "./booking.service";
import {
  AddPropertyBookingDto,
  AddPropertyBookingResponseDto,
} from "./dto/add-property-booking.dto";
import { GetUserBookingsDto } from "./dto/get-user-booking.dto";
import { validateAddPropertyBookingRequest } from "./validations/add-property-booking.validation";
import { validateCancelUserBookingsRequest } from "./validations/cancel-booking.validation";
import { validateGetUserBookingsRequest } from "./validations/get-booking.validation";

@Controller({ route: "booking" })
@RouteTag("Booking")
export class BookingController {
  bookingService: BookingService;
  constructor() {
    this.bookingService = new BookingService();
  }

  @Post()
  @RouteMiddleware([
    authMiddleware,
    (req, res, next) => {
      return validationMiddleware(
        req,
        res,
        next,
        validateAddPropertyBookingRequest
      );
    },
  ])
  @RouteRequestBody(AddPropertyBookingDto)
  @RouteResponseBody(AddPropertyBookingResponseDto)
  async registerMerchant(
    @Request() request: express.Request & { id: string },
    @Response() response: express.Response,
    @Body() bookingDetails: AddPropertyBookingDto
  ): Promise<AddPropertyBookingResponseDto> {
    const bookingResult = await this.bookingService.bookProperty(
      request.id,
      bookingDetails
    );
    response.redirect(bookingResult.checkoutUrl);
    return bookingResult;
  }

  @Get()
  @RouteMiddleware([
    authMiddleware,
    (req, res, next) => {
      return validationMiddleware(
        req,
        res,
        next,
        validateGetUserBookingsRequest
      );
    },
  ])
  @RouteResponseBody(GetUserBookingsDto, {
    isArray: true,
  })
  @RouteSecurity([{ "Jwt Token": [] }])
  async getBookings(
    @Request() request: Express.Request & { id: string }
  ): Promise<GetUserBookingsDto[]> {
    const bookings = await this.bookingService.getBookings(request.id);
    return bookings;
  }

  @Put(":id")
  @RouteMiddleware([
    authMiddleware,
    (req, res, next) => {
      return validationMiddleware(
        req,
        res,
        next,
        validateCancelUserBookingsRequest
      );
    },
  ])
  @RouteResponseBody(GetUserBookingsDto)
  @RouteSecurity([{ "Jwt Token": [] }])
  async cancelBooking(
    @Request() request: Express.Request & { id: string },
    @PathParam("id") id: string
  ): Promise<GetUserBookingsDto> {
    const bookings = await this.bookingService.cancelBooking(id, request.id);
    return bookings;
  }
}
