export interface RegisterInitCredentials {
  email: string;
  password?: string;
  createdBy?: string;
}

export interface RegisterInitCredentialsResponse {
  user: string;
  isActive: boolean;
  payloadRef: string;
}
