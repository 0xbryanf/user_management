import { NextFunction, Request, Response, Router } from "express";
import { Controller } from "types/controller";
import "dotenv/config";
import { authenticateToken } from "lib/middleware/authenticateToken";
import { AuthenticatedRequest } from "types/authenticatedRequest";
import HttpException from "utils/httpException";
import { UsersService } from "services/users.service";

class UsersController implements Controller {
  public router = Router();
  public path = "/api";
  public version = "v1";

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/${this.version}/activate-user`,
      authenticateToken,
      this.activateUserHandler.bind(this)
    );
  }

  private async activateUserHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user_id = (req as AuthenticatedRequest).user?.userId;
      if (!user_id) {
        res.status(401).json({
          statusText: "Unauthorized",
          message: "Invalid Credentials."
        });
        return;
      }
      const result = await UsersService.activateUser(user_id);
      res.status(result.status).json(result);
    } catch (error: unknown) {
      next(new HttpException(500, "Failed to send email confirmation.", error));
    }
  }
}

export default UsersController;
