import * as joi from "joi";

/**
 * Validation object schema to validate env vars and use the processed values
 */
export const validationSchema = joi.object({
  PORT: joi.number().positive().default(8000),

  // Secret token used to authorize the request to server
  JWT_SECRET_TOKEN: joi.string().required(),

  STRIPE_API_KEY: joi.string().required(),
  STRIPE_SUCCESS_URL: joi.string().required(),
  STRIPE_CANCEL_URL: joi.string().required(),
});
