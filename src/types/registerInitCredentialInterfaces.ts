export interface RegisterInit {
  email: string;
  provider?: string;
  provider_user_id?: string;
  email_verified?: boolean;
  password?: string;
  createdBy?: string;
}

export interface RegisterInitCredentialsResponse {
  user?: string;
  isActive?: boolean;
  payloadRef: string;
}
