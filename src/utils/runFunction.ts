import { runAction } from "./runAction";

export const runFunction = async (filename: string): Promise<string[]> => {
  const [action] = filename.split(".");
  const module = require(`../command/${action}`);
  if (module) {
    const defaultActions = module.default.actions;

    if (Array.isArray(defaultActions) && defaultActions.length > 0) {
      const responses = await Promise.all(
        defaultActions.map(
          async (item: {
            schema: string;
            model: string;
            action: string;
            values: object;
          }) => {
            const { schema, model, action, values } = item;
            const actionResponse = await runAction(
              schema,
              model,
              action,
              values
            );
            return actionResponse;
          }
        )
      );
      return responses;
    } else {
      return ["No actions found in the module."];
    }
  }
  return ["Invalid file extension."];
};
