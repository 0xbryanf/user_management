import { registerInitOAuthProviders } from "functions/registerInitOAuthProviders.fn";
import { OAuthAccount, RegisterInitOAuthResponse } from "types/oAuthAccount";
import { ReturnResponse } from "types/returnResponse";

class OAuthProvidersService {
  static async registerInitOAuthProvider({
    email,
    provider,
    provider_user_id,
    email_verified
  }: OAuthAccount): Promise<ReturnResponse<RegisterInitOAuthResponse>> {
    const result = await registerInitOAuthProviders({
      email,
      provider,
      provider_user_id,
      email_verified
    });
    return result;
  }
}

export { OAuthProvidersService };
