import { UserRoleResponse } from "./userRoleResponse";

export interface User {
  user_id: string;
  is_active?: boolean;
  last_login?: string | null;
  created_by?: string;
  created_at?: string;
  updated_by?: string | null;
  updated_at?: string;
  deleted_by?: string | null;
  deleted_at?: string | null;
}

export interface UserResponse {
  user_id: string;
  is_active: boolean;
  last_login?: string | null;
  created_by?: string;
  created_at?: string;
  updated_by?: string | null;
  updated_at?: string;
  deleted_by?: string | null;
  deleted_at?: string | null;
  userRoles?: UserRoleResponse;
}
