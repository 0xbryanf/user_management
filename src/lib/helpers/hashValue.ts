import crypto from "crypto";

/**
 * Hashes a string, number, or object using SHA-256.
 * Ensures consistent output for primitive types and shallow objects.
 *
 * @param value - The value to hash.
 * @returns A SHA-256 hex hash.
 */
export const hashValue = (value: string | number | object): string => {
  const valueToHash =
    typeof value === "object"
      ? JSON.stringify(
          Object.keys(value)
            .sort()
            .reduce(
              (acc, key) => {
                acc[key] = (value as any)[key];
                return acc;
              },
              {} as Record<string, unknown>
            )
        )
      : value.toString();

  return crypto.createHash("sha256").update(valueToHash).digest("hex");
};
