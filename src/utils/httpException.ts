/**
 * Custom HTTP Exception for structured error handling.
 *
 * Extends the native Error class by including an HTTP status code
 * and optional error payload. Useful for consistent API responses.
 *
 * @class HttpException
 * @extends Error
 */
class HttpException extends Error {
  public status: number;
  public error?: string;

  constructor(status: number, message: string, error?: unknown) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
    this.error = error instanceof Error ? error.message : String(error);
    Error.captureStackTrace(this, this.constructor);
  }
}

export default HttpException;
