import { createUser } from "lib/helpers/create-user";
import { createOAuthAccount } from "lib/helpers/createOauthAccount";
import { findUserAcrossEntities } from "lib/helpers/findUserAcrossEntities";
import { RoleHelper } from "lib/helpers/Role";
import { loadSchemaModel } from "schema/loadSchemaModel.utl";
import { RegisterInitOAuthResponse } from "types/oAuthAccount";
import { RegisterInit } from "types/registerInitCredentialInterfaces";
import { ReturnResponse } from "types/returnResponse";
import { generateToken } from "utils/generateToken.utl";
import { RolesEnum } from "utils/rolesEnum.utl";
import { v4 as UUIDV4 } from "uuid";

export const registerInitOAuthProviders = async (
  values: RegisterInit
): Promise<ReturnResponse<RegisterInitOAuthResponse>> => {
  try {
    const { email, provider, provider_user_id, email_verified } = values;
    if (!email || !provider || !provider_user_id || !email_verified) {
      return {
        status: 400,
        statusText: "Bad Request",
        message: "Missing or invalid parameters."
      };
    }

    const [existingUser, defaultRole] = await Promise.all([
      findUserAcrossEntities({ email }),
      RoleHelper.findOne(RolesEnum.READER)
    ]);

    if (!defaultRole) {
      return {
        status: 404,
        statusText: "Not Found",
        message: "Default role not found."
      };
    }

    if (existingUser?.user_id && existingUser?.oauth_provider_id) {
      const token = Buffer.from(generateToken(existingUser.user_id)).toString(
        "base64"
      );
      return {
        status: 409,
        statusText: "Conflict",
        message: "A user with this email already exists.",
        data: {
          user: existingUser.email,
          payloadRef: token
        }
      };
    }

    const user_id = existingUser?.user_id ?? UUIDV4();
    const creator_id = user_id;

    let user;
    if (!existingUser?.user_id) {
      user = await createUser({ user_id, created_by: creator_id });
    } else {
      const UsersModel = await loadSchemaModel("User_Management", "Users");
      user = await UsersModel.findByPk(existingUser.user_id);
      if (!user) throw new Error("User record not found.");
    }

    const userData = "get" in user ? user.get({ plain: true }) : user;

    await createOAuthAccount({
      user_id: userData.user_id,
      email,
      provider,
      provider_user_id,
      email_verified
    });

    const UserRolesModel = await loadSchemaModel(
      "User_Management",
      "UserRoles"
    );

    await UserRolesModel.findOrCreate({
      where: {
        user_id: userData.user_id,
        role_id: defaultRole.role_id
      },
      defaults: {
        user_role_id: UUIDV4(),
        created_by: creator_id
      }
    });

    const token = Buffer.from(generateToken(userData.user_id)).toString(
      "base64"
    );
    console.log("token", token);
    return {
      status: 201,
      statusText: "Created",
      message: "User created successfully.",
      data: {
        user: userData.user_id,
        isActive: userData.is_active,
        payloadRef: token
      }
    };
  } catch (error) {
    console.error("error", error);
    return {
      status: 500,
      statusText: "Internal Server Error",
      message:
        (error as Error).message ||
        "An unexpected error occurred during registration."
    };
  }
};
