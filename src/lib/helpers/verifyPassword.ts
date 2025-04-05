import * as argon2 from "argon2";

export const verifyPassword = async (
  hashedPassword: string,
  plainPassword: string
): Promise<boolean> => {
  try {
    return await argon2.verify(hashedPassword, plainPassword);
  } catch (err) {
    console.error("Password verification failed:", err);
    return false;
  }
};
