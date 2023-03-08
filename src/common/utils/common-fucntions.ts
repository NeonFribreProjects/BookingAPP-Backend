import { BookingStatus } from "@prisma/client";
import dayjs from "dayjs";
import { prisma } from "../../common/utils/prisma";

/**
 * Clean booking records from database
 * which were created due to state inconsistencies
 */
export async function cleanBookingRecords() {
  // Remove all the reserved bookings for which payment is not completed
  const currentDate = dayjs()
    .set("hours", 0)
    .set("minutes", 0)
    .set("seconds", 0)
    .set("milliseconds", 0);

  await prisma.booking.deleteMany({
    where: {
      OR: [
        {
          createdAt: { lt: currentDate.add(32, "minutes").toDate() },
          status: BookingStatus.INPROGRESS,
        },
        {
          status: BookingStatus.INPROGRESS,
          stripeCheckoutSessionId: null,
        },
      ],
    },
  });
}
