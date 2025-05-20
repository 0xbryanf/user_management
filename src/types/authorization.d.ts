export interface Authorization {
  key: string;
  userId: string;
  email?: string;
  authorizationToken: string;
  isAuthorize: boolean;
  expiration: number;
  isActive?: string;
  roles?: string[];
}
