import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsString,
} from "@amishfaldu/swagger-docs";
import {
  AvailableFacilities,
  LongStayAmenities,
  LongStayPropertyAvailability,
  LongStayPropertyLeaseOptions,
  LongStayPropertyRoomType,
  LongStayPropertyType,
  ShortStayCancellation,
  ShortStayCancellationFine,
} from "@prisma/client";

export class AddLongStayPropertyDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

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

  @IsEnum(LongStayPropertyType)
  propertyType: LongStayPropertyType;

  @IsNumber()
  numberOfRooms: number;

  @IsEnum(LongStayPropertyRoomType)
  roomType: LongStayPropertyRoomType;

  @IsNumber()
  numberOfBathrooms: number;

  @IsEnum(LongStayPropertyAvailability)
  availability: LongStayPropertyAvailability;

  @IsBoolean()
  furnished: boolean;

  @IsEnum(LongStayPropertyLeaseOptions)
  lease: LongStayPropertyLeaseOptions;

  @IsArray("String")
  pictures: string[];

  @IsBoolean()
  parking: boolean;

  @IsArray("String", { isItemEnum: true })
  availableFacilities: AvailableFacilities[];

  @IsArray("String", { isItemEnum: true })
  amenities: LongStayAmenities[];

  @IsNumber()
  pricePerMonth: number;

  @IsEnum(ShortStayCancellation)
  cancellation: ShortStayCancellation;

  @IsEnum(ShortStayCancellationFine)
  cancellationFine: ShortStayCancellationFine;
}

export class AddLongStayPropertyResponseDto extends AddLongStayPropertyDto {
  @IsString()
  id: string;

  @IsString()
  createdAt: Date;

  @IsString()
  updatedAt: Date;

  @IsString()
  merchantId: string;
}
