import "module-alias/register";
import App from "./app";
import "dotenv/config";
import { validateEnv } from "utils/validateEnv.utl";
import CredentialsController from "controllers/Credentials.ctrl";
import UsersController from "controllers/Users.ctrl";
import { runCommand } from "utils/runCommand.utl";
import PasswordHistoryController from "controllers/PasswordHistory.ctrl";
import OAuthProviderController from "controllers/OauthProviders.ctrl";

/**
 * Main entry point for the application, handling different command-line arguments.
 *
 * @remarks
 * Supports different runtime modes:
 * - When run with "run -c", executes a command
 * - When run without specific options, validates environment and starts the application server
 *
 * @throws {Error} If there are issues during application initialization or command execution
 */
export const main = async () => {
  validateEnv();
  if (process.argv[2] === "run") {
    const flag = process.argv[3];
    if (flag === "-c") {
      await runCommand();
    } else if (flag) {
      console.error(`The command option '${flag}' is not recognized.`);
      process.exit(1);
    } else {
      const app = new App(
        [
          new CredentialsController(),
          new UsersController(),
          new PasswordHistoryController(),
          new OAuthProviderController()
        ],
        Number(process.env.PORT || 8080)
      );
      app.listen();
    }
  } else {
    console.error(`The command '${process.argv[2]}' is not recognized.`);
    process.exit(1);
  }
};

/**
 * Ensures the main function is only executed when the script is run directly,
 * not when imported as a module. Provides error handling for main function execution.
 *
 * @remarks
 * Wraps the main() function call in a try-catch block to gracefully handle
 * and log any errors that occur during application startup.
 */
if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(`Failed to execute main function:`, error);
  }
}
