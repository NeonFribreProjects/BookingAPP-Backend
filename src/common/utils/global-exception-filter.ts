import { NextFunction, Request, Response } from "express";
import { CustomHttpException } from "./custom-http-error";

export const globalExceptionFilter = (
  error: any,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`global-exception-filter : globalExceptionFilter : `, error);
  if (error?.constructor === CustomHttpException && !res.headersSent) {
    return res.status(error.statuscode).send({ message: error.message });
  } else if (!res.headersSent) {
    return res.status(500).send({ message: "Something went wrong" });
  }

  return next(error);
};
