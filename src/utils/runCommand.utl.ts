import { errorHandlerMiddleware } from "lib/middleware/errorHandlerMiddleware";
import { initializeAssociations } from "./initializeAssociations.utl";
import { runFunction } from "./runFunction.utl";
import {
  sequelizeConnectionDown,
  sequelizeConnectionUp
} from "./sequelizeConnection.utl";

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
  } else {
    console.log(
      commandName ? "Command name not provided." : "Invalid flag or command."
    );
  }
};

export const runCommand = errorHandlerMiddleware(command);
