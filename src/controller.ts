import { Router, Request, Response } from "express";
import AppServices from "./services/appServices";
import { Controller } from "types/controller";
import { CreateUser, RegisterCredentialsInitUser } from "types/createUser";
import "dotenv/config";
import { generateToken } from "utils/generateToken";
import { authenticateToken } from "lib/middleware/authenticateToken";
import { JwtPayload } from "jsonwebtoken";
import { getUserByUserId } from "functions/getUserByUserId";
import { authTokenFromHeader } from "lib/middleware/authTokenFromHeader";

class AppController implements Controller {
  public path = "/api";
  public router = Router();
  public version = "v1";
  private appServices = new AppServices();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/${this.version}/create-user`,
      this.createUserHandler.bind(this)
    );

    this.router.post(
      `${this.path}/${this.version}/register-init-credentials`,
      this.registerInitCredentialsHandler.bind(this)
    );

    this.router.post(
      `${this.path}/${this.version}/verify-user`,
      this.verifyUserHandler.bind(this)
    );

    this.router.post(
      `${this.path}/${this.version}/send-otp-email`,
      authenticateToken,
      this.sendOTPEmail.bind(this)
    );

    this.router.post(
      `${this.path}/${this.version}/verify-otp-email`,
      authenticateToken,
      this.verifyOTPEmail.bind(this)
    );
  }

  private async createUserHandler(req: Request, res: Response): Promise<void> {
    try {
      const userData: CreateUser = req.body;
      const result = await this.appServices.createUserService(userData);
      res.status(result.status).json(result);
    } catch (error: unknown) {
      res.status(500).json({
        message: "Error creating user",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }

  private async registerInitCredentialsHandler(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const userData: RegisterCredentialsInitUser = req.body;
      const result =
        await this.appServices.registerInitCredentialService(userData);
      res.status(result.status).json(result);
    } catch (error: unknown) {
      res.status(500).json({
        message: "Error initial registration of user",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }

  private async verifyUserHandler(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await this.appServices.verifyUserService(email, password);
      if (result.status === 200 && "data" in result) {
        const token = generateToken(result.data);
        res.status(result.status).json({
          message: result.message,
          token
        });
        return;
      }
      res.status(result.status).json(result);
      return;
    } catch (error: unknown) {
      res.status(500).json({
        message: "Error verifying user",
        error: error instanceof Error ? error.message : "Unknown error"
      });
      return;
    }
  }

  private async sendOTPEmail(req: Request, res: Response): Promise<void> {
    try {
      const decoded = authTokenFromHeader(req, res) as JwtPayload;
      const userId = decoded.userId;
      const user = await getUserByUserId({ userId });
      if (!user.data) {
        res.status(404).json({ message: "User data not found" });
        return;
      }
      const email = (user.data as unknown as { email: string }).email;
      const result = await this.appServices.sendOTPEmailService(email);
      res.status(result.status).json(result);
    } catch (error: unknown) {
      console.log(error);
      res.status(500).json({
        message: "Error sending OTP email",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }

  private async verifyOTPEmail(req: Request, res: Response): Promise<void> {
    try {
      const { otp } = req.body;
      const decoded = authTokenFromHeader(req, res) as JwtPayload;
      const userId = decoded.userId;
      const user = await getUserByUserId({ userId });
      if (!user.data) {
        res.status(404).json({ message: "User data not found" });
      }
      const email = (user.data as unknown as { email: string }).email;
      const result = await this.appServices.verifyOTPEmailService(email, otp);
      res.status(result.status).json(result);
    } catch (error: unknown) {
      res.status(500).json({
        message: "Error verifying OTP email",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }
}

export default AppController;
