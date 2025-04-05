import { cleanEnv, port, str, num } from "envalid";

/**
 * Validates the environment variables required for the application.
 * This function uses the `envalid` library to ensure that the necessary
 * environment variables are present and have the correct format.
 */
export const validateEnv = (): void => {
  cleanEnv(process.env, {
    NODE_ENV: str({
      choices: ["development", "staging", "production"]
    }),
    PORT: port(),
    ORIGIN: str(),
    MAXAGE: num(),
    DB_USERNAME: str(),
    DB_PASSWORD: str(),
    DB_DATABASE: str(),
    DB_HOST: str(),
    DB_PORT: port()
  });
};
