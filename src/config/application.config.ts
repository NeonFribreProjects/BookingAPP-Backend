import * as dotenv from "dotenv";
import { validationSchema } from "./validation.schema";

// Load .env file variables
dotenv.config();

const response = validationSchema.validate(process.env, {
  abortEarly: false,
  stripUnknown: true,
});

// Joi validation found errors in env vars
// So throw a new error
if (response.error) {
  throw new Error(response.error.message);
}

// Override the env vars which are processed by joi
// process.env = {
//   ...process.env,
//   ...response.value,
// };

/**
 * Application config object used to determine which env vars are used by this app
 */
export const appConfig = {
  port: process.env.PORT,

  jwt: {
    secretToken: process.env.JWT_SECRET_TOKEN,
    expiresIn: process.env.JWT_EXPIRES_IN || 3600,
  },

  db: {
    url: process.env.DATABASE_URL,
  },

  stripe: {
    apiKey: process.env.STRIPE_API_KEY,
    successUrl: process.env.STRIPE_SUCCESS_URL,
  },

  aws: {
    accessKey: process.env.AWS_ACCESS_KEY,
    secretKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION,
    bucketName: process.env.AWS_S3_BUCKET_NAME,
  },
};


export const corsConfig = {
  allowedOrigins: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : [
    "https://stay2easy.com",
    "https://www.stay2easy.com"
  ],
};
