import { UniqueConstraintError, ValidationError } from "sequelize";
import { ErrorResponse } from "types/errorResponse";

/**
 * Wraps an async function and handles Sequelize and general errors,
 * returning standardized error responses with status codes and messages.
 *
 * @template T - Function type to wrap.
 * @param fn - The async function to wrap.
 * @returns A wrapped function that returns either the original result or an error response.
 */
export const errorHandlerMiddleware = <T extends (...args: any[]) => any>(
  fn: T
) => {
  return async (
    ...args: Parameters<T>
  ): Promise<ErrorResponse | ReturnType<T>> => {
    try {
      return await fn(...args);
    } catch (error) {
      let status = 500;
      let message = "Failed to process request. Please try again.";

      if (error instanceof UniqueConstraintError) {
        status = 409;
        const field = error.errors[0].path || "field";
        message = `${field} must be unique.`;
      } else if (error instanceof ValidationError) {
        status = 400;
        message = error.errors.map((e) => e.message).join(", ");
      } else if (error instanceof Error) {
        message = error.message;

        if (error.message.includes("All required fields")) {
          status = 400;
        } else if (error.message.includes("Default role")) {
          status = 404;
        }
      }

      return {
        status,
        message,
        error: process.env.NODE_ENV === "development" ? error : undefined
      };
    }
  };
};
