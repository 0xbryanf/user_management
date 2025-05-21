import { errorHandlerMiddleware } from "lib/middleware/errorHandlerMiddleware";
import { initializeAssociations } from "../schema/initializeAssociations.utl";
import { runFunction } from "./runFunction.utl";
import {
  sequelizeConnectionDown,
  sequelizeConnectionUp
} from "./sequelizeConnection.utl";

/**
 * Executes a command-line function with Sequelize database connection management.
 *
 * @description Handles command execution with the following workflow:
 * - Validates command-line arguments
 * - Establishes Sequelize database connection
 * - Initializes model associations
 * - Runs specified function dynamically
 * - Logs function responses or errors
 * - Ensures database connection is closed
 *
 * @remarks Supports only '-c' flag for command execution
 * @throws Will exit process with error code if invalid arguments are provided
 */
export const command = async () => {
  const flag = process.argv[3];
  const commandName = process.argv[4];

  if (flag === "-c" && commandName) {
    try {
      await sequelizeConnectionUp();
      await initializeAssociations();
      const functionResponses = await runFunction(commandName);
      if (functionResponses?.length) {
        functionResponses.forEach((response) =>
          console.log(`Response: ${JSON.stringify(response, null, 2)}`)
        );
      } else {
        console.log("No responses received from the function.");
      }
    } catch (error) {
      console.error(`Error running command: ${JSON.stringify(error, null, 2)}`);
    } finally {
      await sequelizeConnectionDown();
    }
  } else if (flag && flag !== "-c") {
    console.error(`Invalid flag: ${flag}. Only '-c' is supported.`);
    process.exit(1);
  } else if (!commandName) {
    console.error("Command name not provided.");
    process.exit(1);
  } else {
    console.error("Invalid flag or command.");
    process.exit(1);
  }
};

export const runCommand = errorHandlerMiddleware(command);
