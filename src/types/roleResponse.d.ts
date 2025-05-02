export interface RoleResponse {
  role_id: string;
  role_name: string;
  created_by: string;
  created_at: Date;
  updated_by: string | null;
  updated_at: Date | null;
  deleted_by: string | null;
  deleted_at: Date | null;
}
