export interface OAuthAccount {
  user_id?: string;
  email: string;
  provider: string;
  provider_user_id: string;
  email_verified: boolean;
}

export interface RegisterInitOAuthResponse {
  user?: string;
  isActive?: boolean;
  payloadRef: string;
}
