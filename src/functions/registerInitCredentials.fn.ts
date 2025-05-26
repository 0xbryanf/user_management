import { generateToken } from "utils/generateToken.utl";
import { v4 as uuidv4 } from "uuid";
import { RolesEnum } from "utils/rolesEnum.utl";
import {
  RegisterInit,
  RegisterInitCredentialsResponse
} from "types/registerInitCredentialInterfaces";
import { createUser } from "lib/helpers/create-user";
import { createCredentials } from "lib/helpers/createCredentials";
import { ReturnResponse } from "types/returnResponse";
import { RoleHelper } from "lib/helpers/Role";
import { Passwords } from "lib/helpers/Password";
import { findUserAcrossEntities } from "lib/helpers/findUserAcrossEntities";
import { loadSchemaModel } from "schema/loadSchemaModel.utl";
import { UniqueConstraintError, ValidationError } from "sequelize";
import { makePayloadRef } from "lib/helpers/makePayloadRef";

export const registerInitCredentials = async (
  values: RegisterInit
): Promise<ReturnResponse<RegisterInitCredentialsResponse>> => {
  const { email, password, createdBy } = values;

  // 1) Validate input
  if (!email || !password) {
    return {
      status: 400,
      statusText: "Bad Request",
      message: "Missing email or password."
    };
  }

  // 2) Hash password, check existing user, get default role in parallel
  const [passwordHash, existingUser, defaultRole] = await Promise.all([
    Passwords.createPassword({ password }),
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

  // 3) Conflict if they already have credentials
  if (existingUser?.user_id && existingUser.credential_id) {
    return {
      status: 409,
      statusText: "Conflict",
      message: "A user with this email already exists.",
      data: {
        user: existingUser.email,
        payloadRef: makePayloadRef(existingUser.user_id)
      }
    };
  }

  // Determine IDs
  const userId = existingUser?.user_id ?? uuidv4();
  const creatorId = existingUser?.user_id ?? createdBy ?? userId;

  try {
    // 4) Create or load user record
    let userRecord = existingUser;
    if (!existingUser) {
      userRecord = await createUser({
        user_id: userId,
        created_by: creatorId
      });
    } else {
      const UsersModel = await loadSchemaModel("User_Management", "Users");
      const found = await UsersModel.findByPk(existingUser.user_id);
      if (!found) throw new Error("User record not found");
      userRecord = found.get({ plain: true });
    }

    // 5) Create credentials + load UserRolesModel in parallel
    const [credential, UserRolesModel] = await Promise.all([
      createCredentials({
        user_id: userRecord.user_id,
        email,
        created_by: creatorId,
        password_hash: passwordHash
      }),
      loadSchemaModel("User_Management", "UserRoles")
    ]);

    // 6) Assign default role (idempotent)
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

    // 7) Store password history
    await Passwords.storePassword({
      user_id: credential.user_id,
      credential_id: credential.credential_id,
      password_hash: passwordHash,
      created_by: credential.user_id
    });

    // 8) Success response
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
    // 9) Handle unique / validation errors
    if (
      err instanceof UniqueConstraintError ||
      err instanceof ValidationError
    ) {
      const conflictId = existingUser?.user_id ?? userId;
      return {
        status: 409,
        statusText: "Conflict",
        message:
          err instanceof ValidationError
            ? "Validation error."
            : "Conflict error.",
        data: {
          user: email,
          payloadRef: makePayloadRef(conflictId)
        }
      };
    }

    // 10) Fallback 500
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
