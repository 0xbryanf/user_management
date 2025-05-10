import { Router, Request, Response, NextFunction } from "express";
import { authenticateToken } from "lib/middleware/authenticateToken";
import { PasswordHistoryService } from "services/PasswordHistory.svc";
import { AuthenticatedRequest } from "types/authenticatedRequest";
import { Controller } from "types/controller";
import HttpException from "utils/httpException.utl";

class PasswordHistoryController implements Controller {
  public router = Router();
  public path = "/api";
  public version = "v1";

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/${this.version}/update-password`,
      authenticateToken,
      this.updatePasswordHandler.bind(this)
    );
  }

  private async updatePasswordHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { password } = req.body;
      const userId = (req as AuthenticatedRequest).user?.userId;
      if (!userId) {
        res.status(401).json({
          statusText: "Unauthorized",
          message: "Invalid Credentials."
        });
        return;
      }
      const result = await PasswordHistoryService.updatePassword({
        password,
        created_by: userId
      });
      res.status(result.status).json(result);
    } catch (error: unknown) {
      next(new HttpException(500, "Error on password update", error));
    }
  }
}

export default PasswordHistoryController;
