import {
  LongStayProperty,
  Merchant,
  Prisma,
  ShortStayProperty,
} from "@prisma/client";
import * as bcrypt from "bcrypt";
import { isEmail } from "class-validator";
import { PASSWORD_HASH_ROUNDS } from "../../common/constants/app.constant";
import { CustomHttpException } from "../../common/utils/custom-http-error";
import { prisma } from "../../common/utils/prisma";
import { JWTService } from "../jwt/jwt.service";
import { AddLongStayPropertyDto } from "./dto/add-long-stay-property.dto";
import { AddShortStayPropertyDto } from "./dto/add-short-stay-property.dto";
import { RegisterMerchantDto } from "./dto/register-merchant.dto";

export class MerchantService {
  private jwtService: JWTService;

  constructor() {
    this.jwtService = new JWTService();
  }

  /**
   * Register merchant
   * @param email - merchant's email
   * @param name - merchant's name
   * @param languagePreference - merchant's language preference
   * @param password - merchant's password
   * @returns jwt token
   */
  async registerMerchant(
    email: string,
    name: string,
    languagePreference: string,
    password: string
  ): Promise<{ token: string }> {
    const existingMerchant = await prisma.merchant.findUnique({
      where: {
        email,
      },
    });
    if (existingMerchant?.id) {
      throw new CustomHttpException(
        400,
        "Merchant with this email already exists"
      );
    }

    const hashedPassword = await bcrypt.hash(password, PASSWORD_HASH_ROUNDS);
    const merchant = await prisma.merchant.create({
      data: {
        name,
        languagePreference,
        email,
        password: hashedPassword,
      },
    });
    delete merchant.password;

    const token = this.jwtService.generateJWTToken({
      email: merchant.email,
      id: merchant.id,
    });
    return { token };
  }

  /**
   * Login merchant
   * @param email - merchant's email
   * @param password - merchant's password
   */
  async loginMerchant(email: string, password: string) {
    const merchant = await prisma.merchant.findUnique({
      where: {
        email,
      },
    });
    if (!merchant) {
      throw new CustomHttpException(400, "Invalid email or password");
    }

    if (!(await bcrypt.compare(password, merchant.password))) {
      throw new CustomHttpException(400, "Invalid email or password");
    }

    delete merchant.password;
    const token = this.jwtService.generateJWTToken({
      email: merchant.email,
      id: merchant.id,
    });
    return { token };
  }

  /**
   * Update merchant details
   * @param id - merchant's id
   * @returns updated merchant details
   */
  async updateMerchant(
    id: string,
    merchantDetails: Partial<RegisterMerchantDto>
  ): Promise<Merchant> {
    const updateData: Prisma.MerchantUpdateInput = {};

    if (merchantDetails.email && isEmail(merchantDetails.email)) {
      const existingMerchant = await prisma.merchant.findUnique({
        where: {
          email: merchantDetails.email,
        },
      });
      if (existingMerchant?.id) {
        throw new CustomHttpException(
          400,
          "Merchant with this email already exists"
        );
      }

      updateData.email = merchantDetails.email;
    }

    if (merchantDetails.password) {
      const hashedPassword = await bcrypt.hash(
        merchantDetails.password,
        PASSWORD_HASH_ROUNDS
      );
      updateData.password = hashedPassword;
    }

    if (merchantDetails.name) {
      updateData.name = merchantDetails.name;
    }

    const merchant = await prisma.merchant.update({
      where: { id },
      data: updateData,
    });
    delete merchant.password;
    return merchant;
  }

  /**
   * Add merchant's short stay property
   * @param id - merchant's id
   * @param propertyDetails - short stay property details
   * @returns property details
   */
  async addShortStayProperty(
    id: string,
    propertyDetails: AddShortStayPropertyDto
  ): Promise<ShortStayProperty> {
    const existingMerchant = await prisma.merchant.findUnique({
      where: {
        id,
      },
    });
    if (!existingMerchant?.id) {
      throw new CustomHttpException(400, "Merchant does not exists");
    }
    const property = await prisma.shortStayProperty.create({
      data: {
        ...propertyDetails,
        merchantId: id,
      },
    });

    return property;
  }

  /**
   * Add merchant's long stay property
   * @param id - merchant's id
   * @param propertyDetails - long stay property details
   * @returns property details
   */
  async addLongStayProperty(
    id: string,
    propertyDetails: AddLongStayPropertyDto
  ): Promise<LongStayProperty> {
    const existingMerchant = await prisma.merchant.findUnique({
      where: {
        id,
      },
    });
    if (!existingMerchant?.id) {
      throw new CustomHttpException(400, "Merchant does not exists");
    }

    const property = await prisma.longStayProperty.create({
      data: {
        ...propertyDetails,
        merchantId: id,
      },
    });

    return property;
  }

  /**
   * Get merchant's property
   * @param id - merchant's id
   * @param propertyType - short or long stay property to fetch
   * @returns property details
   */
  async getProperty(
    id: string,
    propertyType: "ShortStay" | "LongStay"
  ): Promise<ShortStayProperty[] | LongStayProperty[]> {
    let property: LongStayProperty[] | ShortStayProperty[] = [];

    if (propertyType === "LongStay") {
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
    return property;
  }

  // /**
  //  * Get merchant's property bookings
  //  * @param id - merchant's id
  //  * @returns property booking details
  //  */
  // async getBookings(id: string): Promise<Booking[]> {
  //   const property: Booking[] = await prisma.booking.findMany({
  //     where: {
  //       merchantId: id,
  //     },
  //   });
  //   return property;
  // }
}
