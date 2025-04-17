import { Router, Request, Response } from "express";
import AppServices from "./services/appServices";
import { Controller } from "types/controller";
import { CreateUser } from "types/createUser";

class AppController implements Controller {
  public path = "/api";
  public router = Router();
  public version = "v1";
  private appServices = new AppServices();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}/${this.version}/check-connection`,
      this.checkConnectionHandler.bind(this)
    );
    this.router.post(
      `${this.path}/${this.version}/create-user`,
      this.createUserHandler.bind(this)
    );
  }

  private async checkConnectionHandler(_req: Request, res: Response) {
    try {
      const result = await this.appServices.checkConnectionService();
      res.status(result.status).json(result);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error checking connection", error: error.message });
    }
  }

  private async createUserHandler(req: Request, res: Response) {
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
}

export default AppController;
