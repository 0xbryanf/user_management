import * as argon2 from "argon2";

/**
 * Hashes a password using Argon2id with secure parameters.
 * @param password - The plain text password to hash.
 * @returns The hashed password string.
 */
export const hashPassword = async (password: string): Promise<string> => {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16, // 64 MB — balances security and performance
    timeCost: 4, // Iterations (slows brute-force)
    parallelism: 2, // Degree of parallelism
    hashLength: 32 // Output hash length in bytes
  });
};
