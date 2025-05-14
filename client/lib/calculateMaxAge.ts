/**
 * Helper function to calculate Max-Age for the cookie.
 * @param expiresIn - Expiration time string (e.g., "1h", "30m").
 * @returns The calculated Max-Age in seconds.
 */
export function calculateMaxAge(expiresIn: string): number {
  const unit = expiresIn.slice(-1);
  const value = parseInt(expiresIn.slice(0, -1));

  switch (unit) {
    case "s":
      return value; // seconds
    case "m":
      return value * 60; // minutes
    case "h":
      return value * 60 * 60; // hours
    case "d":
      return value * 24 * 60 * 60; // days
    default:
      throw new Error("Invalid expiration format. Use s, m, h, or d.");
  }
}
