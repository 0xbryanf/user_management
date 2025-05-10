import { generateToken } from "utils/generateToken.utl";
import { v4 as UUIDV4 } from "uuid";
import { findOneCredential } from "lib/helpers/findOneCredential";
import { RolesEnum } from "utils/rolesEnum.utl";
import {
  RegisterInit,
  RegisterInitCredentialsResponse
} from "types/registerInitCredentialInterfaces";
import { createUser } from "lib/helpers/create-user";
import { createCredentials } from "lib/helpers/createCredentials";
import { createUserRoles } from "lib/helpers/createUserRoles";
import { ReturnResponse } from "types/returnResponse";
import { RoleHelper } from "lib/helpers/Role";
import { Passwords } from "lib/helpers/Password";

/**
 * Registers initial user credentials with email and password.
 *
 * @param values - Registration details including email and password.
 * @returns A response with status, message, and user payload if successful.
 */
export const registerInitCredentials = async (
  values: RegisterInit
): Promise<ReturnResponse<RegisterInitCredentialsResponse>> => {
  try {
    const { email, password, createdBy } = values;
    if (!email || !password) {
      return {
        status: 400,
        statusText: "Bad Request",
        message: "Missing information to create a user."
      };
    }

    const existingUser = await findOneCredential({ email });

    if (existingUser && existingUser.user_id) {
      const token: string = generateToken(existingUser.user_id);
      return {
        status: 409,
        statusText: "Conflict",
        message: "A user with this email already exists.",
        data: {
          user: existingUser.email,
          payloadRef: Buffer.from(token).toString("base64")
        }
      };
    }

    const userId = UUIDV4();
    const password_hash = await Passwords.createPassword({ password });

    const defaultRole = await RoleHelper.findOne(RolesEnum.READER);
    if (!defaultRole) {
      return {
        status: 404,
        statusText: "Not Found",
        message: "Default role not found."
      };
    }

    const newUser = await createUser({
      user_id: userId,
      created_by: createdBy ? createdBy : userId
    });

    const credential = await createCredentials({
      user_id: newUser.user_id,
      email,
      created_by: createdBy ? createdBy : newUser.user_id,
      password_hash
    });

    await createUserRoles({
      user_id: newUser.user_id,
      role_id: defaultRole.role_id,
      created_by: createdBy ? createdBy : newUser.user_id
    });

    await Passwords.storePassword({
      user_id: credential.user_id,
      credential_id: credential.credential_id,
      password_hash,
      created_by: credential.user_id
    });

    const token: string = generateToken(newUser.user_id);
    return {
      status: 201,
      statusText: "Created",
      message: "User created successfully.",
      data: {
        user: newUser.user_id,
        isActive: newUser.is_active,
        payloadRef: Buffer.from(token).toString("base64")
      }
    };
  } catch (error) {
    return {
      status: 500,
      statusText: "Internal Server Error",
      message:
        (error as Error).message ||
        "An unexpected error occurred during registration."
    };
  }
};
