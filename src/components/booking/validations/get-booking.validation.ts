import { isUUID } from "class-validator";
import { Request } from "express";
import { CustomHttpException } from "../../../common/utils/custom-http-error";

export async function validateGetUserBookingsRequest(
  req: Request & { id: string }
) {
  if (!isUUID(req.id)) {
    throw new CustomHttpException(400, "Invalid user id");
  }
}
