export interface CreateUser {
  username: string;
  email: string;
  password: string;
}

export interface RegisterCredentialsInitUser {
  email: string;
  password: string;
  createdBy?: string;
}
