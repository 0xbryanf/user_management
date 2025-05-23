import { loadSchemaModel } from "schema/loadSchemaModel.utl";
import { OAuthAccount } from "types/oAuthAccount";

export const createOAuthAccount = async ({
  user_id,
  email,
  provider,
  provider_user_id,
  email_verified
}: OAuthAccount) => {
  if (!user_id || !email || !provider || !provider_user_id || !email_verified) {
    throw new Error("Missing required information.");
  }

  const OAuthProvidersModel = await loadSchemaModel(
    "User_Management",
    "OAuthProviders"
  );
  if (!OAuthProvidersModel) {
    throw new Error("Failed to load Oauth_Providers model.");
  }

  const user = await OAuthProvidersModel.create({
    user_id,
    email,
    provider,
    provider_user_id,
    email_verified,
    created_by: user_id
  });

  return user.get({ plain: true });
};
