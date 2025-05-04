import * as argon2 from "argon2";

/**
 * Verifies a plain password against its hashed version.
 *
 * @param hashedPassword - The hashed password from the database.
 * @param plainPassword - The user's input password to check.
 * @returns `true` if the password matches, `false` otherwise.
 */
export const verifyPassword = async (
  hashedPassword: string,
  plainPassword: string
): Promise<boolean> => {
  try {
    return await argon2.verify(hashedPassword, plainPassword);
  } catch (error) {
    // You may log the error for auditing purposes if needed
    return false;
  }
};
