import { registerInitCredentials } from "functions/registerInitCredentials";
import { RegisterInitCredentials } from "types/registerInitCredentialInterfaces";

export default async function registerInitCredentialService({
  email,
  password
}: RegisterInitCredentials) {
  if (!email || !password) {
    return {
      status: 400,
      message: "All required fields must be provided to create a user."
    };
  }

  try {
    const result = await registerInitCredentials({ email, password });
    return result;
  } catch (error: unknown) {
    return {
      status: 500,
      message: "Error creating user",
      error: error instanceof Error ? error.message : String(error)
    };
  }
}
