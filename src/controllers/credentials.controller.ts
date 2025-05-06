import { Router, Request, Response, NextFunction } from "express";
import { Controller } from "types/controller";
import { RegisterInit } from "types/registerInitCredentialInterfaces";
import { CredentialsService } from "services/credentials.services";
import HttpException from "utils/httpException";
import "dotenv/config";
import { authenticateToken } from "lib/middleware/authenticateToken";
import { AuthenticatedRequest } from "types/authenticatedRequest";

class CredentialsController implements Controller {
  public router = Router();
  public path = "/api";
  public version = "v1";

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/${this.version}/register-init-credentials`,
      this.registerInitCredentialsHandler.bind(this)
    );

    this.router.post(
      `${this.path}/${this.version}/request-email-confirmation`,
      authenticateToken,
      this.requestEmailConfirmationHandler.bind(this)
    );

    this.router.post(
      `${this.path}/${this.version}/send-otp-email`,
      authenticateToken,
      this.sendOTPEmailHandler.bind(this)
    );

    this.router.post(
      `${this.path}/${this.version}/verify-otp-email`,
      authenticateToken,
      this.verifyOTPEmailHandler.bind(this)
    );

    this.router.get(
      `${this.path}/${this.version}/verify-credential`,
      this.verifyCredentialHandler.bind(this)
    );

    this.router.get(
      `${this.path}/${this.version}/get-credential-by-email`,
      authenticateToken,
      this.getCredentialByEmailHandler.bind(this)
    );

    this.router.get(
      `${this.path}/${this.version}/get-credential-by-user-id`,
      authenticateToken,
      this.getCredentialByUserIdHandler.bind(this)
    );
  }

  private async registerInitCredentialsHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userData: RegisterInit = req.body;
      const result = await CredentialsService.registerInit(userData);
      res.status(result.status).json(result);
    } catch (error: unknown) {
      next(
        new HttpException(500, "Error initial registration of user.", error)
      );
    }
  }

  private async requestEmailConfirmationHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user?.userId;
      if (!userId) {
        res.status(401).json({
          statusText: "Unauthorized",
          message: "Invalid Credentials."
        });
        return;
      }
      const result = await CredentialsService.requestEmailConfirmation(userId);
      res.status(result.status).json(result);
    } catch (error: unknown) {
      next(new HttpException(500, "Failed to send email confirmation.", error));
    }
  }

  private async sendOTPEmailHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = (req as AuthenticatedRequest).user?.userId;
      if (!userId) {
        res.status(401).json({
          statusText: "Unauthorized",
          message: "Invalid Credentials."
        });
        return;
      }
      const result = await CredentialsService.sendOTPEmail(userId);
      res.status(result.status).json(result);
    } catch (error: unknown) {
      next(new HttpException(500, "Failed to send One-Time Pin.", error));
    }
  }

  private async verifyOTPEmailHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { otp } = req.body;
      const userId = (req as AuthenticatedRequest).user?.userId;
      if (!userId) {
        res.status(401).json({
          statusText: "Unauthorized",
          message: "Invalid Credentials."
        });
        return;
      }
      const result = await CredentialsService.verifyOTPEmail(
        userId,
        parseInt(otp)
      );
      res.status(result.status).json(result);
    } catch (error: unknown) {
      next(new HttpException(500, "Failed to verify One-Time Pin.", error));
    }
  }

  private async verifyCredentialHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const email = req.query.email as string;
      const password = req.query.password as string;
      const result = await CredentialsService.verifyCredentials(
        email,
        password
      );
      res.status(result.status).json(result);
      return;
    } catch (error: unknown) {
      next(new HttpException(500, "Failed to verify credential.", error));
    }
  }

  private async getCredentialByEmailHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const email = req.query.email as string;
      const result = await CredentialsService.getCredentialByEmail(email);
      res.status(result.status).json(result);
    } catch (error: unknown) {
      next(
        new HttpException(
          500,
          "Error retrieving user credential by email.",
          error
        )
      );
    }
  }

  private async getCredentialByUserIdHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.query.id as string;
      const result = await CredentialsService.getCredentialByUserId(userId);
      res.status(result.status).json(result);
    } catch (error: unknown) {
      next(
        new HttpException(
          500,
          "Error retrieving user credential by userid.",
          error
        )
      );
    }
  }
}

export default CredentialsController;
