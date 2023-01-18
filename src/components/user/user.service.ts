import {
  Gender,
  LongStayProperty,
  ShortStayProperty,
  SmokingPreference,
} from "@prisma/client";
import * as bcrypt from "bcrypt";
import { PASSWORD_HASH_ROUNDS } from "../../common/constants/app.constant";
import { CustomHttpException } from "../../common/utils/custom-http-error";
import { prisma } from "../../common/utils/prisma";
import { JWTService } from "../jwt/jwt.service";
import { PropertyType } from "./validations/get-property.validation";

export class UserService {
  private jwtService: JWTService;

  constructor() {
    this.jwtService = new JWTService();
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
    creditCard?: string;
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
        creditCard: data.creditCard,
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
    let property: LongStayProperty[] | ShortStayProperty[] = [];

    if (propertyDetails.propertyType === PropertyType.LONG_STAY) {
      property = await prisma.longStayProperty.findMany({
        where: {
          merchantId: id,
        },
      });

      return property;
    }

    property = await prisma.shortStayProperty.findMany({
      where: {
        merchantId: id,
      },
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
