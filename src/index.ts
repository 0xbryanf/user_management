import "module-alias/register";
import App from "./app";
import "dotenv/config";
import { validateEnv } from "utils/validateEnv.utl";
import CredentialsController from "controllers/Credentials.ctrl";
import UsersController from "controllers/Users.ctrl";
import { runCommand } from "utils/runCommand.utl";

export const main = async () => {
  if (process.argv[2] === "run") {
    switch (process.argv[3]) {
      case "-c":
        await runCommand();
        break;
      default:
        if (process.argv[3]) {
          console.log(
            `The command option '${process.argv[3]}' is not recognized.`
          );
        }
        validateEnv();
        const app = new App(
          [new CredentialsController(), new UsersController()],
          Number((process.env.PORT as string) || 8080)
        );
        app.listen();
        break;
    }
  } else {
    console.log(`The command '${process.argv[2]}' is not recognized.`);
  }
};

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(`Failed to execute main function:`, error);
  }
}
