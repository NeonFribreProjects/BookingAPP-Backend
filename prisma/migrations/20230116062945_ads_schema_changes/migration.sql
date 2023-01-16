-- CreateEnum
CREATE TYPE "SponsoredAdTargetedKeywords" AS ENUM ('description', 'country', 'city', 'postcode', 'numberOfRooms', 'roomType', 'numberOfBathrooms', 'availability', 'furnished', 'lease', 'parking', 'availableFacilities', 'amenities', 'discountedPrice', 'cancellation', 'cancellationFine');

-- CreateEnum
CREATE TYPE "SponsoredAdGrade" AS ENUM ('A', 'B', 'C', 'D', 'E', 'F');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female', 'Other');

-- CreateEnum
CREATE TYPE "SmokingPreference" AS ENUM ('None', 'NonSmoking', 'Smoking');

-- AlterTable
ALTER TABLE "LongStayProperty" ADD COLUMN     "discountedPrice" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "ShortStayProperty" ADD COLUMN     "discountedPrice" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "InterstitialAd" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "targetLocation" TEXT NOT NULL,
    "targetSegment" TEXT NOT NULL,
    "displayFrequency" INTEGER NOT NULL,
    "views" INTEGER NOT NULL,
    "clicks" INTEGER NOT NULL,
    "conversions" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterstitialAd_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SponsoredAd" (
    "id" UUID NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "targetLocation" TEXT NOT NULL,
    "targetKeywords" "SponsoredAdTargetedKeywords"[],
    "grade" "SponsoredAdGrade" NOT NULL,
    "views" INTEGER NOT NULL,
    "clicks" INTEGER NOT NULL,
    "conversions" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "longStayPropertyId" UUID NOT NULL,

    CONSTRAINT "SponsoredAd_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "dob" TIMESTAMP(3),
    "gender" "Gender",
    "smokingPreference" "SmokingPreference" NOT NULL DEFAULT 'None',
    "address" TEXT,
    "creditCard" TEXT NOT NULL,
    "lastSearchedCity" TEXT,
    "lastSearchedCountry" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SponsoredAd" ADD CONSTRAINT "SponsoredAd_longStayPropertyId_fkey" FOREIGN KEY ("longStayPropertyId") REFERENCES "LongStayProperty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
