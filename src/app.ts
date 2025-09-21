import { SwaggerConfig, SwaggerDocs } from "@amishfaldu/swagger-docs";
import express from "express";
import cors from "cors"
import { globalExceptionFilter } from "./common/utils/global-exception-filter";
import { AdsController } from "./components/ads/ads.controller";
import { AWSController } from "./components/aws/aws.controller";
import { BookingController } from "./components/booking/booking.controller";
import { MerchantController } from "./components/merchant/merchant.controller";
import { UserController } from "./components/user/user.controller";

export const app = express();


// ✅ Enable CORS
app.use(
  cors({
    origin: [
      "https://stay2easy.com",
      "https://www.stay2easy.com"
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  })
);


// Consume body in JSON format
app.use(express.json());

// Parse encoded url
app.use(express.urlencoded({ extended: true }));

// Parse incoming query params
app.use(express.query({ parseArrays: true, strictNullHandling: true }));

// Swagger configuration
const swaggerConfig = new SwaggerConfig()
  .setTitle("Booking Backend")
  .setVersion("1.0.0")
  .setDescription("Booking Backend APIs")
  .addSecurity("Jwt Token", {
    in: "header",
    scheme: "Basic",
    type: "apiKey",
    name: "authorization",
  })
  .finalizeConfig();

const swaggerDocs = new SwaggerDocs(swaggerConfig);

// Add router controllers to express application
swaggerDocs.bootstrapControllersToApp([
  AdsController,
  AWSController,
  BookingController,
  MerchantController,
  UserController,
]);

swaggerDocs.setup(app, "api-explorer");

// Use global expection filter to properly log and handle exceptions
// NOTE - Use global exception filter after all the routers are loaded
app.use(globalExceptionFilter);
