import { app } from "./app";
import { appConfig } from "./config/application.config";

/**
 * Start express server with pre-setup stuff and listening to a port
 */
const setupServer = () => {
  app.listen(appConfig.port, () => {
    console.info(
      `Application started on port: ${appConfig.port}. Visit http://localhost:${appConfig.port}/api-explorer for swagger api docs`
    );
  });
};

setupServer();
