import { SwaggerConfig, SwaggerDocs } from "@amishfaldu/swagger-docs";
import * as express from "express";
import { globalExceptionFilter } from "./common/utils/global-exception-filter";

export const app = express();

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
  .finalizeConfig();

const swaggerDocs = new SwaggerDocs(swaggerConfig);

// Add router controllers to express application
swaggerDocs.bootstrapControllersToApp([]);

swaggerDocs.setup(app, "api-explorer");

// Use global expection filter to properly log and handle exceptions
// NOTE - Use global exception filter after all the routers are loaded
app.use(globalExceptionFilter);
