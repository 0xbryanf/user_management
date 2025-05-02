export interface UserRoleResponse {
  user_role_id: string;
  user_id: string;
  role_id: string;
  created_by: string;
  created_at: string;
  updated_by: string | null;
  updated_at: string;
  deleted_by: string | null;
  deleted_at: string | null;
}
