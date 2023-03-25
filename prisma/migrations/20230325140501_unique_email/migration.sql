/*
  Warnings:

  - You are about to drop the column `pricePerPerson` on the `ShortStayProperty` table. All the data in the column will be lost.
  - You are about to drop the column `creditCard` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `LongStayProperty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pricePerMonth` to the `ShortStayProperty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('INPROGRESS', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "LongStayProperty" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "reviewScore" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ShortStayProperty" DROP COLUMN "pricePerPerson",
ADD COLUMN     "pricePerMonth" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "reviewScore" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "creditCard",
ADD COLUMN     "password" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Booking" (
    "id" UUID NOT NULL,
    "stayStartDate" TIMESTAMP(3) NOT NULL,
    "stayEndDate" TIMESTAMP(3) NOT NULL,
    "pricePerMonth" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'INPROGRESS',
    "stripeCheckoutSessionId" TEXT,
    "stripeCheckoutPaymentIntent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "longStayPropertyId" UUID,
    "shortStayPropertyId" UUID,
    "merchantId" UUID NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_longStayPropertyId_fkey" FOREIGN KEY ("longStayPropertyId") REFERENCES "LongStayProperty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_shortStayPropertyId_fkey" FOREIGN KEY ("shortStayPropertyId") REFERENCES "ShortStayProperty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
