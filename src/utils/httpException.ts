/**
 * Represents an HTTP error with a status code and message.
 *
 * This class extends the built-in Error class to provide additional context
 * about HTTP errors, including the status code associated with the error.
 *
 * @class
 * @extends Error
 *
 * @param {number} status - The HTTP status code representing the error.
 * @param {string} message - A descriptive message explaining the error.
 */
class HttpException extends Error {
  public status: number;
  public message: string;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export default HttpException;
