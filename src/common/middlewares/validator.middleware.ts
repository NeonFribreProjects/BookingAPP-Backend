import { NextFunction, Request, Response } from "express";
import { CustomHttpException } from "../utils/custom-http-error";

/**
 * Middleware function to validate requests body
 * @param req - Express request object
 * @param _res - Express response object
 * @param next - Express next function
 * @returns next handler with either no response or an unauthorized error
 */
export const validationMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction,
  validationFunction: (req: Request) => void | Promise<void>
) => {
  try {
    const response = validationFunction(req);
    if (response instanceof Promise) {
      await response;
    }
  } catch (error) {
    if (error instanceof CustomHttpException) {
      return next(error);
    }
    return next(new CustomHttpException(400, "Invalid request"));
  }

  return next();
};
