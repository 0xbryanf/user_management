import { Router, Request, Response, NextFunction } from "express";
import { Controller } from "types/controller";
import "dotenv/config";
import HttpException from "utils/httpException.utl";
import { Role } from "types/roleInterfaces";
import { RolesService } from "services/Roles.svc";
import { ReturnResponse } from "types/returnResponse";
import { authenticateToken } from "lib/middleware/authenticateToken";
/**
 * Controller for role management API endpoints (v1).
 *
 * Handles role assignment and role creation.
 * All routes require authentication.
 */
class RolesController implements Controller {
  public router = Router();
  public path = "/api";
  public version = "v1";

  constructor() {
    this.initializeRoutes();
  }
  /**
   * Registers role management routes and handlers.
   * Endpoints are protected by `authenticateToken` middleware.
   */
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
  /**
   * Handles role assignment requests.
   */
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
  /**
   * Handles role creation requests.
   */
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
