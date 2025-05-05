import { Router, Request, Response, NextFunction } from "express";
import { Controller } from "types/controller";
import { RegisterInit } from "types/registerInitCredentialInterfaces";
import { CredentialsService } from "services/credentials.services";
import HttpException from "utils/httpException";
import { ReturnResponse } from "types/returnResponse";
import "dotenv/config";
import { authenticateToken } from "lib/middleware/authenticateToken";
import { signedTokenFromHeader } from "lib/middleware/signedTokenFromHeader";
import { JwtPayload } from "jsonwebtoken";

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
      async (req: Request, res: Response, next: NextFunction) => {
        await this.registerInitCredentialsHandler(req, res, next);
      }
    );

    this.router.post(
      `${this.path}/${this.version}/request-email-confirmation`,
      async (req: Request, res: Response, next: NextFunction) => {
        await this.requestEmailConfirmationHandler(req, res, next);
      }
    );

    this.router.post(
      `${this.path}/${this.version}/send-otp-email`,
      async (req: Request, res: Response, next: NextFunction) => {
        await this.sendOTPEmailHandler(req, res, next);
      }
    );

    this.router.post(
      `${this.path}/${this.version}/verify-otp-email`,
      async (req: Request, res: Response, next: NextFunction) => {
        await this.verifyOTPEmailHandler(req, res, next);
      }
    );

    this.router.post(
      `${this.path}/${this.version}/verify-credential`,
      async (req: Request, res: Response, next: NextFunction) => {
        await this.verifyCredentialHandler(req, res, next);
      }
    );

    this.router.get(
      `${this.path}/${this.version}/get-credential-by-email`,
      authenticateToken,
      async (req: Request, res: Response, next: NextFunction) => {
        await this.getCredentialByEmailHandler(req, res, next);
      }
    );

    this.router.get(
      `${this.path}/${this.version}/get-credential-by-user-id`,
      authenticateToken,
      async (req: Request, res: Response, next: NextFunction) => {
        await this.getCredentialByUserIdHandler(req, res, next);
      }
    );
  }

  private async registerInitCredentialsHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<ReturnResponse | void> {
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
  ): Promise<ReturnResponse | void> {
    try {
      const decoded = signedTokenFromHeader(req, res) as JwtPayload;
      const result = await CredentialsService.requestEmailConfirmation(decoded);
      res.status(result.status).json(result);
    } catch (error: unknown) {
      next(new HttpException(500, "Failed to send email confirmation.", error));
    }
  }

  private async sendOTPEmailHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<ReturnResponse | void> {
    try {
      const decoded = signedTokenFromHeader(req, res) as JwtPayload;
      const result = await CredentialsService.sendOTPEmail(decoded);
      res.status(result.status).json(result);
    } catch (error: unknown) {
      next(new HttpException(500, "Failed to send One-Time Pin.", error));
    }
  }

  private async verifyOTPEmailHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<ReturnResponse | void> {
    try {
      const { otp } = req.body;
      const decoded = signedTokenFromHeader(req, res) as JwtPayload;
      const result = await CredentialsService.verifyOTPEmail(
        decoded,
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
  ): Promise<ReturnResponse | void> {
    try {
      const { email, password } = req.body;
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
  ): Promise<ReturnResponse | void> {
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
  ): Promise<ReturnResponse | void> {
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
