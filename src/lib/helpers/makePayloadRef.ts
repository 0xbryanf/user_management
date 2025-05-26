import { generateToken } from "utils/generateToken.utl";

export const makePayloadRef = (userId: string): string => {
  return Buffer.from(generateToken(userId)).toString("base64");
};
