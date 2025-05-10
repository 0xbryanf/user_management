import { runAction } from "./runAction.utl";

export const runFunction = async (filename: string): Promise<string[]> => {
  try {
    // Extracting the action name before ".cmd.ts"
    const [action] = filename.split(".cmd.ts");
    if (!action) {
      return ["Invalid file name format."];
    }

    // Dynamically importing the module
    const modulePath = `../command/${action}.cmd`;
    const module = await import(modulePath);

    if (!module?.default?.actions) {
      return ["No actions found in the module."];
    }

    const defaultActions = module.default.actions;

    if (!Array.isArray(defaultActions) || defaultActions.length === 0) {
      return ["No actions found in the module."];
    }

    // Executing each action using runAction
    const responses = await Promise.all(
      defaultActions.map(async (item: any) => {
        const { schema, model, action, values } = item;

        if (!schema || !model || !action) {
          return "Invalid action format in module.";
        }

        try {
          const actionResponse = await runAction(schema, model, action, values);
          return actionResponse;
        } catch (err) {
          return `Error executing action: ${err}`;
        }
      })
    );

    return responses;
  } catch (error: unknown) {
    console.error("Error in runFunction:", error);
    return [
      `Failed to execute runFunction: ${error instanceof Error ? error.message : String(error)}`
    ];
  }
};
