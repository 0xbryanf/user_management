/**
 * Converts a camelCase or PascalCase string to snake_case.
 * @param str - The input string.
 * @returns The snake_cased string.
 */
export const camelToSnake = (str: string): string =>
  str.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
