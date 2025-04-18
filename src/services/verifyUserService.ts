import { verifyUser } from "functions/verifyUser";

export default async function verifyUserService(
  email: string,
  password: string
) {
  if (!email || !password) {
    return {
      status: 400,
      message: "All required fields must be provided to verify a user."
    };
  }

  try {
    const result = await verifyUser({ email, password });
    return result;
  } catch (error: unknown) {
    return {
      status: 500,
      message: "Error creating user",
      error: error instanceof Error ? error.message : String(error)
    };
  }
}
