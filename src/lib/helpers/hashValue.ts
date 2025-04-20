import crypto from "crypto";

export const hashValue = (value: string | number | object) => {
  let valueToHash: string;

  if (typeof value === "object") {
    valueToHash = JSON.stringify(value);
  } else {
    valueToHash = value.toString();
  }

  return crypto.createHash("sha256").update(valueToHash).digest("hex");
};
