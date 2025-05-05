import { Router, Request, Response, NextFunction } from "express";
import { Controller } from "types/controller";
import "dotenv/config";
import HttpException from "utils/httpException";
import { Role } from "types/roleInterfaces";
import { RolesService } from "services/roles.service";
import { ReturnResponse } from "types/returnResponse";
import { authenticateToken } from "lib/middleware/authenticateToken";

class RolesController implements Controller {
  public router = Router();
  public path = "/api";
  public version = "v1";

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/${this.version}/assign-role`,
      authenticateToken,
      async (req: Request, res: Response, next: NextFunction) => {
        await this.assignRoleHandler(req, res, next);
      }
    );

    this.router.post(
      `${this.path}/${this.version}/create-role`,
      authenticateToken,
      async (req: Request, res: Response, next: NextFunction) => {
        await this.createRoleHandler(req, res, next);
      }
    );
  }

  private async assignRoleHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<ReturnResponse | void> {
    try {
      const roleData: Role = req.body;
      const result = await RolesService.assignRole(roleData);
      res.status(result.status).json(result);
    } catch (error: unknown) {
      next(
        new HttpException(500, "Error initial registration of user.", error)
      );
    }
  }

  private async createRoleHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<ReturnResponse | void> {
    try {
      const roleData: Role = req.body;
      const result = await RolesService.createRole(roleData);
      res.status(result.status).json(result);
    } catch (error: unknown) {
      next(new HttpException(500, "Error creating role", error));
    }
  }
}

export default RolesController;
