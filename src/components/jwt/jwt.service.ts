import * as jwt from "jsonwebtoken";
import { appConfig } from "../../config/application.config";
import { IJWTPayload } from "./interface/jwt-payload.interface";

export class JWTService {
  /**
   * Generate JWT token for user auth
   * @param payload - payload to store in JWT token
   * @returns signed JWT Token
   */
  generateJWTToken(payload: IJWTPayload): string {
    const token = jwt.sign(payload, appConfig.jwt.secretToken, {
      expiresIn: appConfig.jwt.expiresIn,
    });
    return token;
  }
}
