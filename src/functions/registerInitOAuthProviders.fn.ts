import { createUser } from "lib/helpers/create-user";
import { createOAuthAccount } from "lib/helpers/createOauthAccount";
import { findUserAcrossEntities } from "lib/helpers/findUserAcrossEntities";
import { RoleHelper } from "lib/helpers/Role";
import { loadSchemaModel } from "schema/loadSchemaModel.utl";
import { RegisterInitOAuthResponse } from "types/oAuthAccount";
import { RegisterInit } from "types/registerInitCredentialInterfaces";
import { ReturnResponse } from "types/returnResponse";
import { RolesEnum } from "utils/rolesEnum.utl";
import { v4 as uuidv4 } from "uuid";
import { UniqueConstraintError, ValidationError } from "sequelize";
import { makePayloadRef } from "lib/helpers/makePayloadRef";

export const registerInitOAuthProviders = async (
  values: RegisterInit
): Promise<ReturnResponse<RegisterInitOAuthResponse>> => {
  const { email, provider, provider_user_id, email_verified } = values;

  // 1) Validate input
  if (!email || !provider || !provider_user_id || email_verified !== true) {
    return {
      status: 400,
      statusText: "Bad Request",
      message: "Missing or invalid parameters."
    };
  }

  // 2) Find any existing user and the default role in parallel
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

  // 3) If they already have an OAuth account, bail out with a conflict
  if (existingUser?.user_id && existingUser.oauth_provider_id) {
    return {
      status: 409,
      statusText: "Conflict",
      message: "A user with this OAuth provider already exists.",
      data: {
        user: existingUser.email,
        payloadRef: makePayloadRef(existingUser.user_id)
      }
    };
  }

  // Determine user IDs
  const userId = existingUser?.user_id ?? uuidv4();
  const creatorId = existingUser?.user_id ?? userId;

  try {
    // 4) Create or load the User record
    let userRecord = existingUser;
    if (!existingUser) {
      userRecord = await createUser({ user_id: userId, created_by: creatorId });
    } else {
      const UsersModel = await loadSchemaModel("User_Management", "Users");
      const found = await UsersModel.findByPk(existingUser.user_id);
      if (!found) throw new Error("User record not found");
      userRecord = found.get({ plain: true });
    }

    // 5) Create the OAuth account
    await createOAuthAccount({
      user_id: userRecord.user_id,
      email,
      provider,
      provider_user_id,
      email_verified
    });

    // 6) Ensure the default role association
    const UserRolesModel = await loadSchemaModel(
      "User_Management",
      "UserRoles"
    );
    await UserRolesModel.findOrCreate({
      where: {
        user_id: userRecord.user_id,
        role_id: defaultRole.role_id
      },
      defaults: {
        user_role_id: uuidv4(),
        created_by: creatorId
      }
    });

    // 7) Success!
    return {
      status: 201,
      statusText: "Created",
      message: "User created successfully.",
      data: {
        user: userRecord.user_id,
        isActive: (userRecord as any).is_active,
        payloadRef: makePayloadRef(userRecord.user_id)
      }
    };
  } catch (err: unknown) {
    // 8) Handle conflicts (e.g. unique constraint or validation errors)
    if (
      err instanceof UniqueConstraintError ||
      err instanceof ValidationError
    ) {
      const conflictUserId = existingUser?.user_id ?? userId;
      return {
        status: 409,
        statusText: "Conflict",
        message:
          err instanceof ValidationError
            ? "Validation error."
            : "Conflict error.",
        data: {
          user: email,
          payloadRef: makePayloadRef(conflictUserId)
        }
      };
    }

    // 9) Anything else is a 500
    return {
      status: 500,
      statusText: "Internal Server Error",
      message:
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during registration."
    };
  }
};
