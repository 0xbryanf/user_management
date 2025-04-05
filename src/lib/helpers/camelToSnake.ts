export const camelToSnake = (str: string) =>
  str
    .split(/(?=[A-Z])/)
    .join("_")
    .toLowerCase();
