import { RolesEnum } from "utils/rolesEnum";

export interface Role {
  email?: string;
  role_name: RolesEnum;
  created_by: string;
}

export interface RoleResponse {
  role_id: string;
  role_name: RolesEnum;
  created_by: string;
  created_at: Date;
  updated_by: string | null;
  updated_at: Date | null;
  deleted_by: string | null;
  deleted_at: Date | null;
}
