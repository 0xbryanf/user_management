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
      const result = await UsersService.activateUserService(user_id);
      res.status(result.status).json(result);
    } catch (error: unknown) {
      next(new HttpException(500, "Failed to send email confirmation.", error));
    }
  }

  // ✅ Updated createAuthorizationHandler with Promise<void>
  private async createAuthorizationHandler(
    req: Request,
    res: Response
  ): Promise<void> {
    let responseSent = false;

    try {
      const authHeader = (req as AuthenticatedRequest).headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({
          statusText: "Unauthorized",
          message: "Missing or invalid Authorization header."
        });
        responseSent = true;
        return;
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        res.status(401).json({
          statusText: "Unauthorized",
          message: "Bearer token is missing."
        });
        responseSent = true;
        return;
      }

      const user_id =
        (req as AuthenticatedRequest).user?.userId || "Unknown User";

      let authData = {
        key: "5b68e1f5c9f84b3aa3d7e4f9ab3c3c2f1234567890abcdef1234567890abcdef",
        userId: user_id,
        email: "user@example.com",
        authorizationToken:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5NTYwMDQ5NC01MGQ5LTQxNjktOWMwMS05ODk3MzgyODU0ZTMiLCJpYXQiOjE2ODM4NTUwMDB9.abc123def456ghi789jkl012mno345pqr678stu901vwx234yz56789",
        isAuthorize: true,
        expiration: 120
      };

      const result = await UsersService.createAuthorizationService(authData);
      if (!responseSent) {
        res.status(result.status).json(result);
        responseSent = true;
      }
    } catch (error: unknown) {
      if (!responseSent) {
        res.status(500).json({
          statusText: "Internal Server Error",
          message: "Failed to create authorization.",
          error: (error as Error).message
        });
      }
    }
  }
}
export default UsersController;
