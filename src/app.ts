import express, { Application, Request, Response } from "express";
import { Controller } from "types/controller";
import helmet from "helmet";
import cors, { CorsOptions } from "cors";
import "dotenv/config";
import compression from "compression";
import { errorHandler } from "helpers/errorHandler";
import { sequelizeConnectionUp } from "utils/sequelizeConnection";
import { initializeAssociations } from "utils/initializeAssociations";

const { ORIGIN, MAXAGE } = process.env;

/**
 * CORS (Cross-Origin Resource Sharing) options for configuring the CORS middleware.
 *
 * This configuration allows you to specify the origins that are permitted to
 * access resources, the methods that are allowed, the headers that can be used,
 * and whether credentials are allowed in the requests.
 *
 * @type {CorsOptions}
 * @property {function} origin - A function that determines if the specified origin is allowed. The function receives the origin and a callback as parameters.
 * If the origin is allowed, it invokes the callback with `null` error and `true`. If the origin is not allowed, it invokes the callback with an error.
 * @property {string[]} methods - An array of HTTP methods that are allowed (e.g., GET and POST).
 * @property {string[]} allowedHeaders - An array of headers that are permitted in requests.
 * @property {boolean} credentials - Indicates whether or not to expose credentials (cookies, authorization headers, or TLS client certificates) to the frontend.
 */
const corsOptions: CorsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    const allowedOrigins = [ORIGIN as string];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false
};

/**
 * @class App
 * @description A class that encapsulates an Express application with middleware,
 * controllers, error handling, and database connection management.
 */
class App {
  public express: Application;
  public port: number;

  /**
   * Creates an instance of the App class.
   * @param {Controller[]} controllers - An array of controller instances to initialize with the application.
   * @param {number} port - The port number for the application to listen on.
   */
  constructor(controllers: Controller[], port: number) {
    this.express = express();
    this.port = port;
    this.initializeMiddleware();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
    this.initializeDatabaseConnection();
  }

  /**
   * Initializes middleware for the Express application.
   * @private
   * @returns {void}
   */
  private initializeMiddleware(): void {
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(
      helmet.contentSecurityPolicy({
        directives: {
          defaultSrc: ["'self'"],
          imgSrc: ["'self'"],
          scriptSrc: ["'self'"]
        }
      })
    );
    this.express.use(helmet.referrerPolicy({ policy: "no-referrer" }));
    this.express.use(helmet.xssFilter());
    this.express.use(helmet.noSniff());
    this.express.use(helmet.frameguard({ action: "deny" }));
    this.express.use(
      helmet.hsts({
        maxAge: parseInt(MAXAGE as string),
        includeSubDomains: true,
        preload: true
      })
    );
    this.express.use(helmet.hidePoweredBy());
    this.express.use(cors(corsOptions));
    this.express.use(
      compression({
        threshold: 1024, // Compress responses larger than 1KB
        filter: (_req: Request, res: Response) => {
          const type = res.getHeader("Content-Type");
          return /json|text|html|css|js/i.test(type as string);
        }
      })
    );
    // Add morgan if you want logging here.
  }

  /**
   * Initializes the controllers for the Express application.
   * @private
   * @param {Controller[]} controllers - An array of controller instances to be registered.
   * @returns {void}
   */
  private initializeControllers(controllers: Controller[]): void {
    controllers.forEach((controller: Controller) => {
      this.express.use("/v1", controller.router);
    });
  }

  /**
   * Initializes error handling middleware for the Express application.
   * @private
   * @returns {void}
   */
  private initializeErrorHandling(): void {
    this.express.use(errorHandler);
  }

  /**
   * Initializes the database connection.
   * @private
   * @returns {void}
   */
  private async initializeDatabaseConnection(): Promise<void> {
    try {
      await sequelizeConnectionUp();
      await initializeAssociations();
    } catch (error) {
      console.error("Failed to connect to the database:", error);
      process.exit(1);
    }
  }

  /**
   * Gracefully shuts down the server.
   * @private
   * @returns {void}
   */
  private shutdown(): void {
    try {
      console.log("Shutting down server...");
      process.exit(0);
    } catch (error) {
      console.error("Error during server shutdown:", error);
      process.exit(1);
    }
  }

  /**
   * Starts the server and listens for incoming requests.
   * @public
   * @returns {void}
   */
  public listen(): void {
    this.express.listen(this.port, () => {
      console.log(`This server is running on port ${this.port}`);
    });

    // To handle graceful shutdown.
    process.on("SIGINT", this.shutdown);
    process.on("SIGTERM", this.shutdown);
  }
}

export default App;
