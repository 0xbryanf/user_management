import { NextFunction, Request, Response, Router } from "express";
import { Controller } from "types/controller";
import "dotenv/config";
import { authenticateToken } from "lib/middleware/authenticateToken";
import { AuthenticatedRequest } from "types/authenticatedRequest";
import HttpException from "utils/httpException.utl";
import { UsersService } from "services/Users.svc";

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

    this.router.post(
      `${this.path}/${this.version}/create-authorization`,
      authenticateToken,
      this.createAuthorizationHandler.bind(this)
    );

    this.router.post(
      `${this.path}/${this.version}/get-authorization`,
      authenticateToken,
      this.getAuthorizationHandler.bind(this)
    );
  }

  private async activateUserHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const user_id = (req as AuthenticatedRequest).user?.userId;

    if (!user_id) {
      res.status(401).json({
        statusText: "Unauthorized",
        message: "Invalid Credentials."
      });
      return;
    }

    try {
      const result = await UsersService.activateUserService(user_id);
      res.status(result.status).json(result);
    } catch (error: unknown) {
      next(new HttpException(500, "Failed to send email confirmation.", error));
    }
  }

  private async createAuthorizationHandler(
    req: Request,
    res: Response
  ): Promise<void> {
    const authHeader = (req as AuthenticatedRequest).headers.authorization;
    const { session } = req.body;
    if (!session || !authHeader?.startsWith("Bearer ")) {
      res.status(401).json({
        statusText: "Unauthorized",
        message: "Missing or invalid credentials."
      });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({
        statusText: "Unauthorized",
        message: "Bearer token is missing."
      });
      return;
    }

    const user_id =
      (req as AuthenticatedRequest).user?.userId || "Unknown User";

    const authData = {
      key: session,
      userId: user_id,
      authorizationToken: token,
      isAuthorize: false,
      expiration: 900 // 15 minutes
    };

    try {
      const result = await UsersService.createAuthorizationService(authData);
      res.status(result.status).json(result);
    } catch (error: unknown) {
      res.status(500).json({
        statusText: "Internal Server Error",
        message: "Failed to create authorization.",
        error: (error as Error).message
      });
    }
  }

  private async getAuthorizationHandler(
    req: Request,
    res: Response
  ): Promise<void> {
    const authHeader = (req as AuthenticatedRequest).headers.authorization;
    const { key } = req.body;
    if (!key || !authHeader?.startsWith("Bearer ")) {
      res.status(401).json({
        statusText: "Unauthorized",
        message: "Missing or invalid credentials."
      });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({
        statusText: "Unauthorized",
        message: "Bearer token is missing."
      });
      return;
    }

    try {
      const result = await UsersService.getAuthorizationService(key);
      res.status(result.status).json(result);
    } catch (error: unknown) {
      res.status(500).json({
        statusText: "Internal Server Error",
        message: "Failed to retrieve authorization.",
        error: (error as Error).message
      });
    }
  }
}
export default UsersController;
