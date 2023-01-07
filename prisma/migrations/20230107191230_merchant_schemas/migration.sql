-- CreateEnum
CREATE TYPE "ShortStayPropertyType" AS ENUM ('Hotel', 'Apartment');

-- CreateEnum
CREATE TYPE "SmokingPolicy" AS ENUM ('Smoking', 'NoSmoking');

-- CreateEnum
CREATE TYPE "ShortStayPropertyBedOptions" AS ENUM ('SingleBed', 'DoubleBed', 'LargeBed', 'ExtraLargeDoubleBed', 'BunkBed', 'SofaBed', 'FutonMat');

-- CreateEnum
CREATE TYPE "ShortStayBreakfastOptions" AS ENUM ('Included', 'NotIncluded');

-- CreateEnum
CREATE TYPE "AvailableFacilities" AS ENUM ('FreeWiFi', 'Restaurants', 'RoomService', 'Bar', 'TwentyFourHourFrontDesk', 'Sauna', 'FitnessCentre', 'Garden', 'Terrace', 'NonSmokingRooms', 'AirportShuttle', 'FamilyRooms', 'SpaAndWellnessCentre', 'HotTubOrJacuzzi', 'AirConditioning', 'WaterPark', 'SwimmingPool');

-- CreateEnum
CREATE TYPE "ShortStayAmenities" AS ENUM ('AirConditioning', 'Bath', 'SpaBath', 'FlatScreenTV', 'ElectricKettle', 'BalconyView', 'Terrece');

-- CreateEnum
CREATE TYPE "ShortStayCancellation" AS ENUM ('NonRefundable', 'OneDayBeforeArrival', 'TwoDaysBeforeArrival', 'CancelUntillDayOfArrival');

-- CreateEnum
CREATE TYPE "ShortStayCancellationFine" AS ENUM ('FirstNightPrice', 'FullStayPrice');

-- CreateEnum
CREATE TYPE "LongStayPropertyType" AS ENUM ('House', 'Apartment', 'Studio', 'Room');

-- CreateEnum
CREATE TYPE "LongStayPropertyRoomType" AS ENUM ('SingleRoom', 'DoubleRoom', 'Ensuite');

-- CreateEnum
CREATE TYPE "LongStayPropertyAvailability" AS ENUM ('Immediately', 'SpecificDay', 'Month');

-- CreateEnum
CREATE TYPE "LongStayPropertyLeaseOptions" AS ENUM ('MinimumSixMonths', 'SpecificNumberOfMonths');

-- CreateEnum
CREATE TYPE "LongStayAmenities" AS ENUM ('AirConditioning', 'Bath', 'SpaBath', 'FlatScreenTV', 'ElectricKettle', 'BalconyView', 'Terrece', 'Cooker', 'MicroWave', 'Fridge');

-- CreateTable
CREATE TABLE "Merchant" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "languagePreference" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Merchant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" UUID NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "shortStayPropertyId" UUID NOT NULL,
    "longStayPropertyId" UUID,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShortStayProperty" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "propertyType" "ShortStayPropertyType" NOT NULL,
    "starRating" DOUBLE PRECISION,
    "streetAddress" TEXT NOT NULL,
    "addressLine2" TEXT,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postCode" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "contactPhoneNumber" TEXT NOT NULL,
    "contactAlternativePhoneNumber" TEXT,
    "roomName" TEXT NOT NULL,
    "customName" TEXT NOT NULL,
    "roomType" TEXT NOT NULL,
    "smokingPolicy" "SmokingPolicy" NOT NULL,
    "numberOfRooms" INTEGER NOT NULL,
    "bedOptions" "ShortStayPropertyBedOptions" NOT NULL,
    "numberOfGuestsAllowed" INTEGER NOT NULL,
    "roomSize" DOUBLE PRECISION NOT NULL,
    "parking" BOOLEAN NOT NULL,
    "breakfast" "ShortStayBreakfastOptions" NOT NULL,
    "languagesSpoken" TEXT[],
    "availableFacilities" "AvailableFacilities"[],
    "extraBedOption" BOOLEAN NOT NULL,
    "amenities" "ShortStayAmenities"[],
    "pictures" TEXT[],
    "checkInTime" TEXT NOT NULL,
    "checkOutTime" TEXT NOT NULL,
    "children" BOOLEAN NOT NULL,
    "pets" BOOLEAN NOT NULL,
    "creditCard" BOOLEAN NOT NULL,
    "commissionPercentage" DOUBLE PRECISION NOT NULL,
    "pricePerPerson" DOUBLE PRECISION NOT NULL,
    "cancellation" "ShortStayCancellation" NOT NULL,
    "cancellationFine" "ShortStayCancellationFine" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "merchantId" UUID NOT NULL,

    CONSTRAINT "ShortStayProperty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LongStayProperty" (
    "id" UUID NOT NULL,
    "description" TEXT NOT NULL,
    "streetAddress" TEXT NOT NULL,
    "addressLine2" TEXT,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postCode" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "contactPhoneNumber" TEXT NOT NULL,
    "contactAlternativePhoneNumber" TEXT,
    "propertyType" "LongStayPropertyType" NOT NULL,
    "numberOfRooms" INTEGER NOT NULL,
    "roomType" "LongStayPropertyRoomType" NOT NULL,
    "numberOfBathrooms" INTEGER NOT NULL DEFAULT 1,
    "availability" "LongStayPropertyAvailability" NOT NULL,
    "furnished" BOOLEAN NOT NULL,
    "Lease" "LongStayPropertyLeaseOptions" NOT NULL,
    "pictures" TEXT[],
    "parking" BOOLEAN NOT NULL,
    "availableFacilities" "AvailableFacilities"[],
    "amenities" "LongStayAmenities"[],
    "pricePerMonth" DOUBLE PRECISION NOT NULL,
    "cancellation" "ShortStayCancellation" NOT NULL,
    "cancellationFine" "ShortStayCancellationFine" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "merchantId" UUID NOT NULL,

    CONSTRAINT "LongStayProperty_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Merchant_email_key" ON "Merchant"("email");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_shortStayPropertyId_fkey" FOREIGN KEY ("shortStayPropertyId") REFERENCES "ShortStayProperty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_longStayPropertyId_fkey" FOREIGN KEY ("longStayPropertyId") REFERENCES "LongStayProperty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShortStayProperty" ADD CONSTRAINT "ShortStayProperty_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LongStayProperty" ADD CONSTRAINT "LongStayProperty_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
