import { Router, Request, Response } from "express";
import AppServices from "./services/appServices";
import { Controller } from "types/controller";
import { CreateUser } from "types/createUser";
import "dotenv/config";
import { generateOtpEmailHtml } from "utils/otpTemplate";
import { generateToken } from "utils/generateToken";
import { authenticateToken } from "lib/middleware/authenticateToken";

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
      `${this.path}/${this.version}/verify-user`,
      this.verifyUserHandler.bind(this)
    );

    this.router.post(
      `${this.path}/${this.version}/send-otp-email`,
      authenticateToken,
      this.sendOTPEmail.bind(this)
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
        message: "Error creating user",
        error: error instanceof Error ? error.message : "Unknown error"
      });
      return;
    }
  }

  private async sendOTPEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      const { SENDGRID_OTP_EMAIL: from } = process.env;

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const subject = `Your One Time OTP Code - ${otp}`;
      const html = generateOtpEmailHtml(otp);

      const result = await this.appServices.sendOTPEmailService(
        email,
        from!,
        subject,
        html
      );

      res.status(result.status).json(result);
    } catch (error: unknown) {
      res.status(500).json({
        message: "Error creating user",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }
}

export default AppController;
