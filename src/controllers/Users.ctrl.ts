import {
  Router,
  Request,
  Response,
  NextFunction,
  RequestHandler
} from "express";
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
      this.activateUserHandler as RequestHandler
    );

    this.router.post(
      `${this.path}/${this.version}/create-authorization`,
      authenticateToken,
      this.createAuthorizationHandler as RequestHandler
    );

    this.router.post(
      `${this.path}/${this.version}/get-authorization`,
      authenticateToken,
      this.getAuthorizationHandler as RequestHandler
    );

    this.router.post(
      `${this.path}/${this.version}/activate-authorization`,
      authenticateToken,
      this.activateAuthorizationHandler as RequestHandler
    );
  }

  private async activateUserHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const user_id = (req as AuthenticatedRequest).user?.userId as string;
      const result = await UsersService.activateUserService(user_id);
      return res.status(result.status).json(result);
    } catch (error) {
      return next(new HttpException(500, "Internal Server Error.", error));
    }
  }

  private async createAuthorizationHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const authHeader = (req as AuthenticatedRequest).headers
        .authorization as string;
      const { session } = req.body;
      const token = authHeader.split(" ")[1];
      const user_id =
        (req as AuthenticatedRequest).user?.userId || "Unknown User";

      const result = await UsersService.createAuthorizationService(
        session,
        token,
        user_id,
        false,
        900
      );
      return res.status(result.status).json(result);
    } catch (error) {
      return next(new HttpException(500, "Internal Server Error.", error));
    }
  }

  private async getAuthorizationHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { key } = req.body;
      const result = await UsersService.getAuthorizationService(key);
      return res.status(result.status).json(result);
    } catch (error) {
      return next(new HttpException(500, "Internal Server Error.", error));
    }
  }

  private async activateAuthorizationHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { key } = req.body;
      const result = await UsersService.activateAuthorization(key);
      return res.status(result.status).json(result);
    } catch (error) {
      return next(new HttpException(500, "Internal Server Error.", error));
    }
  }
}
export default UsersController;
