import { Op } from "sequelize";
import { Role, RoleResponse } from "types/roleInterfaces";
import { loadSchemaModel } from "schema/loadSchemaModel.utl";
import { RolesEnum } from "utils/rolesEnum.utl";

/**
 * Helper class for interacting with Roles.
 */
class RoleHelper {
  /**
   * Creates a new role in the database.
   * @param role - Object containing role_name and created_by.
   * @returns The created Role object.
   */
  static async createRole({
    role_name,
    created_by
  }: Role): Promise<RoleResponse> {
    if (!role_name || !created_by) {
      throw new Error(`Missing information to create: ${role_name}`);
    }

    const RolesModel = await loadSchemaModel("User_Management", "Roles");
    if (!RolesModel) {
      throw new Error("Failed to load Roles model.");
    }

    const newRole = await RolesModel.create({ role_name, created_by });
    return newRole.get({ plain: true }) as RoleResponse;
  }

  /**
   * Finds a role by its enum name.
   * @param role - Role name from RolesEnum.
   * @returns The matched Role object or null if not found.
   */
  static async findOne(role: RolesEnum): Promise<RoleResponse | null> {
    if (!role) {
      throw new Error("Role name is required to find the role.");
    }

    const RolesModel = await loadSchemaModel("User_Management", "Roles");
    if (!RolesModel) {
      throw new Error("Failed to load Roles model.");
    }

    const roleData = await RolesModel.findOne({
      where: { role_name: role }
    });

    return roleData ? (roleData.get({ plain: true }) as RoleResponse) : null;
  }

  /**
   * Fetches all roles from the database.
   * @returns An array of RoleResponse objects.
   */
  static async findAll(): Promise<RoleResponse[]> {
    const RolesModel = await loadSchemaModel("User_Management", "Roles");
    if (!RolesModel) {
      throw new Error("Failed to load Roles model.");
    }

    const roles = await RolesModel.findAll();
    return roles.map((role) => role.get({ plain: true })) as RoleResponse[];
  }

  /**
   * Fetches system-level privileged roles only.
   * @returns An array of RoleResponse objects with only `role_id` fields.
   */
  static async privilegedRoles(): Promise<RoleResponse[]> {
    const RolesModel = await loadSchemaModel("User_Management", "Roles");
    if (!RolesModel) {
      throw new Error("Failed to load Roles model.");
    }

    const roles = (await RolesModel.findAll({
      where: {
        role_name: {
          [Op.in]: ["admin", "moderator", "developer"]
        }
      },
      attributes: [
        "role_id",
        "role_name",
        "created_by",
        "created_at",
        "updated_by",
        "updated_at"
      ],
      raw: true
    })) as unknown as RoleResponse[];

    return roles;
  }
}

export { RoleHelper };
