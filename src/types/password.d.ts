export interface Password {
  user_id?: string;
  credential_id?: string;
  password: string;
  created_by?: string;
  created_at?: Date | null;
  changed_by?: string | null;
  changed_at?: Date;
  updated_by?: string | null;
  updated_at?: Date | null;
}
