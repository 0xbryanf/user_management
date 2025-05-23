import {
  Router,
  Request,
  Response,
  NextFunction,
  RequestHandler
} from "express";
import { Controller } from "types/controller";
import HttpException from "utils/httpException.utl";
import "dotenv/config";
import { OAuthAccount } from "types/oAuthAccount";
import { OAuthProvidersService } from "services/OAuthProviders.svc";

class OAuthProviderController implements Controller {
  public router = Router();
  public path = "/api";
  public version = "v1";

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/${this.version}/register-init-oauth`,
      this.registerInitOauthProviderHandler as RequestHandler
    );
  }

  private async registerInitOauthProviderHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const userData: OAuthAccount = req.body;
      const result =
        await OAuthProvidersService.registerInitOAuthProvider(userData);
      return res.status(result.status).json(result);
    } catch (error) {
      return next(new HttpException(500, "Internal Server Error.", error));
    }
  }
}

export default OAuthProviderController;
