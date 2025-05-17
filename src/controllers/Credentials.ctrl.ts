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
      this.registerInitCredentialsHandler as RequestHandler
    );

    this.router.post(
      `${this.path}/${this.version}/request-email-confirmation`,
      authenticateToken,
      this.requestEmailConfirmationHandler as RequestHandler
    );

    this.router.post(
      `${this.path}/${this.version}/send-otp-email`,
      authenticateToken,
      this.sendOTPEmailHandler as RequestHandler
    );

    this.router.post(
      `${this.path}/${this.version}/verify-otp-email`,
      authenticateToken,
      this.verifyOTPEmailHandler as RequestHandler
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

  private async sendOTPEmailHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const userId = (req as AuthenticatedRequest).user?.userId as string;
      const result = await CredentialsService.sendOTPEmail(userId);
      return res.status(result.status).json(result);
    } catch (error) {
      return next(new HttpException(500, "Internal Server Error.", error));
    }
  }

  private async verifyOTPEmailHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { otp } = req.body;
      const userId = (req as AuthenticatedRequest).user?.userId as string;
      const result = await CredentialsService.verifyOTPEmail(
        userId,
        parseInt(otp)
      );
      return res.status(result.status).json(result);
    } catch (error) {
      return next(new HttpException(500, "Internal Server Error.", error));
    }
  }

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
