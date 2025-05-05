import { Router } from "express";
import { Controller } from "types/controller";
import "dotenv/config";

class UsersController implements Controller {
  public router = Router();
  public path = "/api";
  public version = "v1";

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {}
}

export default UsersController;
