import {
  AvailableFacilities,
  Gender,
  LongStayAmenities,
  LongStayProperty,
  ShortStayAmenities,
  ShortStayProperty,
  ShortStayPropertyBedOptions,
  SmokingPreference,
} from "@prisma/client";
import * as bcrypt from "bcrypt";
import { PASSWORD_HASH_ROUNDS } from "../../common/constants/app.constant";
import { CustomHttpException } from "../../common/utils/custom-http-error";
import { prisma } from "../../common/utils/prisma";
import { BookingService } from "../booking/booking.service";
import { JWTService } from "../jwt/jwt.service";
import { PropertyType } from "./validations/get-property.validation";

export class UserService {
  private jwtService: JWTService;
  private bookingService: BookingService;

  constructor() {
    this.jwtService = new JWTService();
    this.bookingService = new BookingService();
  }

  /**
   * Register user
   * @param email - user's email
   * @param name - user's name
   * @param languagePreference - user's language preference
   * @param password - user's password
   * @returns jwt token
   */
  async registerUser(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    mobileNumber: string;
    dob?: string;
    gender?: Gender;
    smokingPreference?: SmokingPreference;
    address?: string;
  }): Promise<{ token: string }> {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (existingUser?.id) {
      throw new CustomHttpException(400, "User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(
      data.password,
      PASSWORD_HASH_ROUNDS
    );
    const user = await prisma.user.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        mobileNumber: data.mobileNumber,
        address: data.address,
        dob: data.dob,
        gender: data.gender,
        smokingPreference: data.smokingPreference,
        password: hashedPassword,
      },
    });
    delete user.password;

    const token = this.jwtService.generateJWTToken({
      email: user.email,
      id: user.id,
    });
    return { token };
  }

  /**
   * Login user
   * @param email - user's email
   * @param password - user's password
   */
  async loginUser(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new CustomHttpException(400, "Invalid email or password");
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new CustomHttpException(400, "Invalid email or password");
    }

    delete user.password;
    const token = this.jwtService.generateJWTToken({
      email: user.email,
      id: user.id,
    });
    return { token };
  }

  async getUser(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user.id) {
      throw new CustomHttpException(400, "Invalid user id");
    }
    return user;
  }

  /**
   * Get user's property
   * @param id - user's id
   * @param propertyType - short or long stay property to fetch
   * @returns property details
   */
  async getProperty(
    id: string,
    propertyDetails: {
      propertyType?: string;
      startDate?: string;
      endDate?: string;
      rooms?: number;
      guests?: number;
      children?: boolean;
      minPrice?: number;
      maxPrice?: number;
      facilities?: string;
      amenities?: string;
      bedPreference?: string;
      star?: number;
      reviewScore?: number;
      city?: string;
      country?: string;
    },
    pagination: { skip: number; limit: number }
  ): Promise<ShortStayProperty[] | LongStayProperty[]> {
    // clean up in-consistent booking records
    await this.bookingService.cleanBookingRecords();

    let property: LongStayProperty[] | ShortStayProperty[] = [];

    if (propertyDetails.propertyType === PropertyType.LONG_STAY) {
      property = await prisma.longStayProperty.findMany({
        where: {
          numberOfRooms: { gte: propertyDetails.rooms },
          pricePerMonth: {
            gte: propertyDetails.minPrice,
            lte: propertyDetails.maxPrice,
          },
          discountedPrice: {
            gte: propertyDetails.minPrice,
            lte: propertyDetails.maxPrice,
          },
          availableFacilities: {
            hasSome: propertyDetails.facilities.split(
              ","
            ) as AvailableFacilities[],
          },
          amenities: {
            hasSome: propertyDetails.amenities.split(
              ","
            ) as LongStayAmenities[],
          },
          reviewScore: { gte: propertyDetails.reviewScore },
          city: propertyDetails.city,
          country: propertyDetails.country,
          booking: {
            none: {
              AND: [
                {
                  OR: [
                    {
                      stayStartDate: {
                        lt: propertyDetails.startDate,
                      },
                    },
                    {
                      stayStartDate: {
                        lt: propertyDetails.endDate,
                      },
                    },
                  ],
                },
                {
                  OR: [
                    {
                      stayEndDate: {
                        gt: propertyDetails.startDate,
                      },
                    },
                    {
                      stayEndDate: {
                        gt: propertyDetails.endDate,
                      },
                    },
                  ],
                },
              ],
            },
          },
        },
        skip: pagination.skip,
        take: pagination.limit,
      });

      return property;
    }

    // TODO - don't show property which are booked for the given start and end date
    property = await prisma.shortStayProperty.findMany({
      where: {
        numberOfRooms: { gte: propertyDetails.rooms },
        numberOfGuestsAllowed: { gte: propertyDetails.guests },
        children: propertyDetails.children,
        pricePerMonth: {
          gte: propertyDetails.minPrice,
          lte: propertyDetails.maxPrice,
        },
        discountedPrice: {
          gte: propertyDetails.minPrice,
          lte: propertyDetails.maxPrice,
        },
        availableFacilities: {
          hasSome: propertyDetails.facilities.split(
            ","
          ) as AvailableFacilities[],
        },
        amenities: {
          hasSome: propertyDetails.amenities.split(",") as ShortStayAmenities[],
        },
        bedOptions:
          propertyDetails.bedPreference as ShortStayPropertyBedOptions,
        starRating: propertyDetails.star,
        reviewScore: { gte: propertyDetails.reviewScore },
        city: propertyDetails.city,
        country: propertyDetails.country,
        booking: {
          none: {
            AND: [
              {
                OR: [
                  {
                    stayStartDate: {
                      lt: propertyDetails.startDate,
                    },
                  },
                  {
                    stayStartDate: {
                      lt: propertyDetails.endDate,
                    },
                  },
                ],
              },
              {
                OR: [
                  {
                    stayEndDate: {
                      gt: propertyDetails.startDate,
                    },
                  },
                  {
                    stayEndDate: {
                      gt: propertyDetails.endDate,
                    },
                  },
                ],
              },
            ],
          },
        },
      },
      skip: pagination.skip,
      take: pagination.limit,
    });

    if (propertyDetails.city || propertyDetails.country) {
      await prisma.user.update({
        where: { id },
        data: {
          lastSearchedCity: propertyDetails.city ?? undefined,
          lastSearchedCountry: propertyDetails.country ?? undefined,
        },
      });
    }
    return property;
  }
}
