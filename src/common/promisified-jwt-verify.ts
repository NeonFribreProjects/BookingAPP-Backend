import { promisify } from "util";
import * as jwt from "jsonwebtoken";

/**
 * Promisified version of jwt.verify method
 * @param arg1 - The token you want to validate
 * @param arg2 - JWT secret used to sign the token
 * @param arg3 - Verify options to pass to jwt.verify method
 */
export const jwtVerifyPromisified = promisify<
  string,
  jwt.Secret,
  jwt.VerifyOptions
>(jwt.verify);
