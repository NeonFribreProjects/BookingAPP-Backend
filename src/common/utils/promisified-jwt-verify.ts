import * as jwt from "jsonwebtoken";
import { promisify } from "util";

/**
 * Promisified version of jwt.verify method
 * @param arg1 - The token you want to validate
 * @param arg2 - JWT secret used to sign the token
 * @param arg3 - Verify options to pass to jwt.verify method
 */
export const jwtVerifyPromisified = promisify<
  string,
  jwt.Secret,
  jwt.VerifyOptions,
  jwt.Jwt
>(jwt.verify);
