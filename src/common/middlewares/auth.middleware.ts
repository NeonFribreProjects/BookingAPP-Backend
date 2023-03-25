import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { appConfig } from "../../config/application.config";
import { CustomHttpException } from "../utils/custom-http-error";
import { jwtVerifyPromisified } from "../utils/promisified-jwt-verify";

/**
 * Middleware function to authenticate requests
 * @param req - Express request object
 * @param _res - Express response object
 * @param next - Express next function
 * @returns next handler with either no response or an unauthorized error
 */
export const authMiddleware = async (
  req: Request & { id: string },
  _res: Response,
  next: NextFunction
) => {
  const jwtToken = req?.headers?.authorization;
  if (!jwtToken) {
    return next(
      new CustomHttpException(401, "Not authorized to perform operation")
    );
  }

  try {
    const jwtPayload = await jwtVerifyPromisified(
      jwtToken,
      appConfig.jwt.secretToken,
      {
        ignoreExpiration: false,
        ignoreNotBefore: false,
        complete: true,
      }
    );
    req.id = (jwtPayload.payload as JwtPayload).id;
  } catch (error) {
    return next(new CustomHttpException(401, "Invalid or expired token"));
  }

  return next();
};
