export interface Password {
  user_id?: string;
  credential_id?: string;
  password?: string;
  password_hash?: string;
  created_by?: string;
  created_at?: Date | null;
  updated_by?: string | null;
  updated_at?: Date | null;
}
