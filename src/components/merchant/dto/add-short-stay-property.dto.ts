import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsString,
} from "@amishfaldu/swagger-docs";
import {
  AvailableFacilities,
  ShortStayAmenities,
  ShortStayBreakfastOptions,
  ShortStayCancellation,
  ShortStayCancellationFine,
  ShortStayPropertyBedOptions,
  ShortStayPropertyType,
  SmokingPolicy,
} from "@prisma/client";

export class AddShortStayPropertyDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsEnum(ShortStayPropertyType)
  propertyType: ShortStayPropertyType;

  @IsNumber()
  starRating: number | null;

  @IsString()
  streetAddress: string;

  @IsString()
  addressLine2: string | null;

  @IsString()
  country: string;

  @IsString()
  city: string;

  @IsString()
  postCode: string;

  @IsString()
  contactName: string;

  @IsString()
  contactPhoneNumber: string;

  @IsString()
  contactAlternativePhoneNumber: string | null;

  @IsString()
  roomName: string;

  @IsString()
  customName: string;

  @IsString()
  roomType: string;

  @IsEnum(SmokingPolicy)
  smokingPolicy: SmokingPolicy;

  @IsNumber()
  numberOfRooms: number;

  @IsEnum(ShortStayPropertyBedOptions)
  bedOptions: ShortStayPropertyBedOptions;

  @IsNumber()
  numberOfGuestsAllowed: number;

  @IsNumber()
  roomSize: number;

  @IsBoolean()
  parking: boolean;

  @IsEnum(ShortStayBreakfastOptions)
  breakfast: ShortStayBreakfastOptions;

  @IsArray("String")
  languagesSpoken: string[];

  @IsArray("String", { isItemEnum: true })
  availableFacilities: AvailableFacilities[];

  @IsBoolean()
  extraBedOption: boolean;

  @IsArray("String", { isItemEnum: true })
  amenities: ShortStayAmenities[];

  @IsArray("String")
  pictures: string[];

  @IsString()
  checkInTime: string;

  @IsString()
  checkOutTime: string;

  @IsBoolean()
  children: boolean;

  @IsBoolean()
  pets: boolean;

  @IsBoolean()
  creditCard: boolean;

  @IsNumber()
  commissionPercentage: number;

  @IsNumber()
  pricePerMonth: number;

  @IsEnum(ShortStayCancellation)
  cancellation: ShortStayCancellation;

  @IsEnum(ShortStayCancellationFine)
  cancellationFine: ShortStayCancellationFine;
}

export class AddShortStayPropertyResponseDto extends AddShortStayPropertyDto {
  @IsString()
  id: string;

  @IsString()
  createdAt: Date;

  @IsString()
  updatedAt: Date;

  @IsString()
  merchantId: string;
}
