import { UserResponse } from "./userInterfaces";

export interface CredentialResponse {
  credential_id: string;
  user_id: string;
  email: string;
  password_hash: string;
  created_by: string;
  created_at: string;
  updated_by: string | null;
  updated_at: string;
  deleted_by: string | null;
  deleted_at: string | null;
  user?: UserResponse;
}
