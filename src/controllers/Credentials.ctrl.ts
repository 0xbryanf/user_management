import {
  Router,
  Request,
  Response,
  NextFunction,
  RequestHandler
} from "express";
import { Controller } from "types/controller";
import { RegisterInit } from "types/registerInitCredentialInterfaces";
import HttpException from "utils/httpException.utl";
import "dotenv/config";
import { authenticateToken } from "lib/middleware/authenticateToken";
import { AuthenticatedRequest } from "types/authenticatedRequest";
import { CredentialsService } from "services/Credentials.svc";
/**
 * Controller for credentials and email verification API endpoints (v1).
 *
 * Handles credential registration, email confirmation requests,
 * OTP email sending and verification, and credential lookups.
 * Most routes require authentication.
 */
class CredentialsController implements Controller {
  public router = Router();
  public path = "/api";
  public version = "v1";

  constructor() {
    this.initializeRoutes();
  }
  /**
   * Registers credential management routes and their handlers.
   * Most endpoints are protected by `authenticateToken` middleware.
   */
  private initializeRoutes() {
    this.router.post(
      `${this.path}/${this.version}/register-init-credentials`,
      this.registerInitCredentialsHandler as RequestHandler
    );

    this.router.post(
      `${this.path}/${this.version}/request-email-confirmation`,
      authenticateToken,
      this.requestEmailConfirmationHandler as RequestHandler
    );

    this.router.post(
      `${this.path}/${this.version}/verify-credential`,
      this.verifyCredentialHandler as RequestHandler
    );

    this.router.get(
      `${this.path}/${this.version}/get-credential-by-email`,
      authenticateToken,
      this.getCredentialByEmailHandler as RequestHandler
    );

    this.router.get(
      `${this.path}/${this.version}/get-credential-by-user-id`,
      authenticateToken,
      this.getCredentialByUserIdHandler as RequestHandler
    );
  }
  /**
   * Handles registration of initial user credentials.
   */
  private async registerInitCredentialsHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const userData: RegisterInit = req.body;
      const result = await CredentialsService.registerInit(userData);
      return res.status(result.status).json(result);
    } catch (error) {
      return next(new HttpException(500, "Internal Server Error.", error));
    }
  }
  /**
   * Handles email confirmation request.
   */
  private async requestEmailConfirmationHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const userId = (req as AuthenticatedRequest).user?.userId;
      if (!userId) {
        return res.status(401).json({
          statusText: "Unauthorized",
          message: "Invalid Credentials."
        });
      }

      const result = await CredentialsService.requestEmailConfirmation(userId);
      return res.status(result.status).json(result);
    } catch (error) {
      return next(new HttpException(500, "Internal Server Error.", error));
    }
  }

  /**
   * Handles user credential verification (sign in).
   */
  private async verifyCredentialHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { email, password } = req.body;
      const result = await CredentialsService.verifyCredentials(
        email,
        password
      );
      return res.status(result.status).json(result); // Using return
    } catch (error) {
      return next(new HttpException(500, "Internal Server Error.", error));
    }
  }
  /**
   * Retrieves credentials by email.
   */
  private async getCredentialByEmailHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const email = req.query.email as string;
      const result = await CredentialsService.getCredentialByEmail(email);
      return res.status(result.status).json(result);
    } catch (error) {
      return next(new HttpException(500, "Internal Server Error.", error));
    }
  }
  /**
   * Retrieves credentials by user ID.
   */
  private async getCredentialByUserIdHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const userId = req.query.id as string;
      const result = await CredentialsService.getCredentialByUserId(userId);
      return res.status(result.status).json(result); // Using return
    } catch (error) {
      return next(new HttpException(500, "Internal Server Error.", error));
    }
  }
}

export default CredentialsController;
