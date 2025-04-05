import * as argon2 from "argon2";

export const hashPassword = async (password: string): Promise<string> => {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 4,
    parallelism: 2,
    hashLength: 32
  });
};
