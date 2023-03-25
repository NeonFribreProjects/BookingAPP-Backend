import {
  Booking,
  BookingStatus,
  LongStayProperty,
  ShortStayCancellation,
  ShortStayCancellationFine,
  ShortStayProperty,
} from "@prisma/client";
import dayjs from "dayjs";
import Stripe from "stripe";
import { cleanBookingRecords } from "../../common/utils/common-fucntions";
import { CustomHttpException } from "../../common/utils/custom-http-error";
import { prisma } from "../../common/utils/prisma";
import { appConfig } from "../../config/application.config";
import { UserService } from "../user/user.service";
import { PropertyType } from "../user/validations/get-property.validation";
import {
  AddPropertyBookingDto,
  AddPropertyBookingResponseDto,
} from "./dto/add-property-booking.dto";
import { CheckoutSuccessDto } from "./dto/checkout-success.dto";

const stripeClient = new Stripe(appConfig.stripe.apiKey, {
  apiVersion: "2022-11-15",
  maxNetworkRetries: 3,
  timeout: 10000,
});

export class BookingService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Get user's property bookings
   * @param id - user's id
   * @param bookingDetails - booking details
   * @returns property booking details
   */
  async bookProperty(
    id: string,
    bookingDetails: AddPropertyBookingDto
  ): Promise<AddPropertyBookingResponseDto> {
    const user = await this.userService.getUser(id);

    let property: LongStayProperty | ShortStayProperty | null = null;
    if (bookingDetails.propertyType === PropertyType.LONG_STAY) {
      property = await prisma.longStayProperty.findUnique({
        where: {
          id: bookingDetails.propertyId,
        },
      });
    } else if (bookingDetails.propertyType === PropertyType.SHORT_STAY) {
      property = await prisma.shortStayProperty.findUnique({
        where: {
          id: bookingDetails.propertyId,
        },
      });
    }

    if (!property) {
      throw new CustomHttpException(400, "Invalid property");
    }

    let pricePerMonth = property.discountedPrice;
    if (!pricePerMonth) {
      pricePerMonth = property.pricePerMonth;
    }

    const stayStartDate = dayjs(bookingDetails.stayStartDate)
      .set("hours", 0)
      .set("minutes", 0)
      .set("seconds", 0)
      .set("milliseconds", 0);
    const stayEndDate = dayjs(bookingDetails.stayEndDate)
      .set("hours", 0)
      .set("minutes", 0)
      .set("seconds", 0)
      .set("milliseconds", 0);

    const daysToStay = stayEndDate.diff(stayStartDate, "days");
    const totalPrice = (pricePerMonth * daysToStay) / 30;

    await cleanBookingRecords();

    const propertyBooking = await prisma.$transaction(
      async (tx) => {
        const existingBooking = await tx.booking.findFirst({
          where: {
            OR: [
              {
                shortStayPropertyId: bookingDetails.propertyId,
              },
              {
                longStayPropertyId: bookingDetails.propertyId,
              },
            ],
            AND: [
              {
                OR: [
                  {
                    stayStartDate: {
                      lt: stayStartDate.toDate(),
                    },
                  },
                  {
                    stayStartDate: {
                      lt: stayEndDate.toDate(),
                    },
                  },
                ],
              },
              {
                OR: [
                  {
                    stayEndDate: {
                      gt: stayStartDate.toDate(),
                    },
                  },
                  {
                    stayEndDate: {
                      gt: stayEndDate.toDate(),
                    },
                  },
                ],
              },
            ],
          },
        });

        if (existingBooking?.id) {
          throw new CustomHttpException(
            400,
            "Property already booked within this date range"
          );
        }

        const propertyBooking = await tx.booking.create({
          data: {
            pricePerMonth: pricePerMonth,
            stayEndDate: stayEndDate.toDate(),
            stayStartDate: stayStartDate.toDate(),
            totalPrice: totalPrice,
            longStayPropertyId:
              bookingDetails.propertyType === PropertyType.LONG_STAY
                ? bookingDetails.propertyId
                : null,
            shortStayPropertyId:
              bookingDetails.propertyType === PropertyType.SHORT_STAY
                ? bookingDetails.propertyId
                : null,
            userId: id,
            merchantId: property.merchantId,
          },
        });

        return propertyBooking;
      },
      {
        maxWait: 10000,
        timeout: 10000,
      }
    );

    const stripeCheckoutSessionExpireTime = dayjs().add(30, "minutes");

    // Generate checkout session object
    const checkoutSession = await stripeClient.checkout.sessions.create({
      success_url: appConfig.stripe.successUrl,
      // cancel_url: appConfig.stripe.cancelUrl,
      currency: "USD",
      expires_at: stripeCheckoutSessionExpireTime.unix(),
      invoice_creation: { enabled: true },
      line_items: [
        {
          adjustable_quantity: { enabled: false },
          price_data: {
            currency: "USD",
            product_data: {
              name: property.name,
              description: property.description,
              images: property.pictures.slice(0, 8),
            },
            unit_amount_decimal: `${totalPrice}`,
          },
        },
      ],
      metadata: {
        bookingId: propertyBooking.id,
      },
      mode: "payment",
      submit_type: "book",
      payment_intent_data: {
        receipt_email: user.email,
      },
    });

    await prisma.booking.update({
      where: { id: propertyBooking.id },
      data: {
        stripeCheckoutSessionId: checkoutSession.id,
        stripeCheckoutPaymentIntent: checkoutSession.payment_intent.toString(),
      },
    });

    return { checkoutUrl: checkoutSession.url };
  }

  async paymentAcceptedConfirmation(sessionData: CheckoutSuccessDto) {
    const checkoutSession = await stripeClient.checkout.sessions.retrieve(
      sessionData.sessionId
    );
    if (checkoutSession.payment_status === "paid") {
      await prisma.booking.update({
        where: { id: checkoutSession.metadata.bookingId },
        data: {
          status: "COMPLETED",
        },
      });
      return { success: true };
    }

    await prisma.booking.deleteMany({
      where: {
        stripeCheckoutSessionId: sessionData.sessionId,
        status: {
          not: "COMPLETED",
        },
      },
    });
    return { success: false };
  }

  /**
   * Get user's property bookings
   * @param id - user's id
   * @returns property booking details
   */
  async getBookings(id: string): Promise<Booking[]> {
    await cleanBookingRecords();

    const property: Booking[] = await prisma.booking.findMany({
      where: {
        userId: id,
      },
    });
    return property;
  }

  /**
   * Amount in dollars to refund to customer when cancelling
   * @param booking - booking details
   * @returns amount in dollars to refund
   */
  cancelBookingAmount(
    booking: Booking & {
      longStayProperty: {
        id: string;
        cancellation: ShortStayCancellation;
        cancellationFine: ShortStayCancellationFine;
      };
      shortStayProperty: {
        id: string;
        cancellation: ShortStayCancellation;
        cancellationFine: ShortStayCancellationFine;
      };
    }
  ) {
    let property = booking.longStayProperty;
    if (!property?.id) {
      property = booking.shortStayProperty;
    }

    if (property.cancellation === ShortStayCancellation.NonRefundable) {
      return 0;
    }

    const bookingStartDate = dayjs(booking.stayStartDate);
    const bookingEndDate = dayjs(booking.stayEndDate);
    const totalDays = bookingEndDate.diff(bookingStartDate, "days");
    const currentDate = dayjs();
    if (
      property.cancellation ===
        ShortStayCancellation.CancelUntillDayOfArrival &&
      bookingStartDate.isBefore(currentDate) &&
      property.cancellationFine !== ShortStayCancellationFine.FullStayPrice
    ) {
      return (booking.totalPrice * (totalDays - 1)) / totalDays;
    }

    if (
      property.cancellation === ShortStayCancellation.OneDayBeforeArrival &&
      bookingStartDate.isBefore(currentDate.subtract(1, "day")) &&
      property.cancellationFine !== ShortStayCancellationFine.FullStayPrice
    ) {
      return (booking.totalPrice * (totalDays - 1)) / totalDays;
    }

    if (
      property.cancellation === ShortStayCancellation.TwoDaysBeforeArrival &&
      bookingStartDate.isBefore(currentDate.subtract(2, "day")) &&
      property.cancellationFine !== ShortStayCancellationFine.FullStayPrice
    ) {
      return (booking.totalPrice * (totalDays - 1)) / totalDays;
    }

    return 0;
  }

  /**
   * Get user's property bookings
   * @param id - booking id
   * @param userId - user's id
   * @returns property booking details
   */
  async cancelBooking(id: string, userId: string): Promise<Booking> {
    const booking = await prisma.booking.findFirst({
      where: {
        id,
        userId,
        status: BookingStatus.COMPLETED,
      },
      include: {
        longStayProperty: {
          select: {
            id: true,
            cancellation: true,
            cancellationFine: true,
          },
        },
        shortStayProperty: {
          select: {
            id: true,
            cancellation: true,
            cancellationFine: true,
          },
        },
      },
    });

    if (!booking.id) {
      throw new CustomHttpException(400, "Invalid booking id");
    }

    const cancelledBooking = await prisma.$transaction(
      async (tx) => {
        const updatedBooking = await tx.booking.update({
          where: {
            id,
          },
          data: {
            status: BookingStatus.CANCELLED,
          },
        });

        const refundAmount = this.cancelBookingAmount(booking);
        await stripeClient.refunds.create({
          payment_intent: booking.stripeCheckoutPaymentIntent,
          // Amount to refund in cents
          amount: refundAmount * 100,
        });

        return updatedBooking;
      },
      {
        maxWait: 5000,
        timeout: 10000,
      }
    );

    return cancelledBooking;
  }
}
