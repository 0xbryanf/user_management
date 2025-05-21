import { ActionTree } from "schema";
import { loadSchemaModel } from "../schema/loadSchemaModel.utl";

/**
 * Runs a specified action for a given schema and model with provided payload.
 *
 * @param schema - The name of the schema containing the action
 * @param model - The name of the model within the schema
 * @param action - The specific action to be executed
 * @param payload - An object containing additional parameters for the action
 * @returns The result of executing the specified action
 * @throws {Error} If the specified action is not found in the model
 */
export const runAction = async (
  schema: string,
  model: string,
  action: string,
  payload: object
) => {
  const schemaModel = await loadSchemaModel(schema, model);
  const descriptor = ActionTree[schema]?.[model];
  if (!descriptor?.actions?.[action]) {
    throw new Error(`Action ${action} not found on ${model}`);
  }

  const runnableFunction = descriptor.actions[action];
  const result = await runnableFunction({
    schemaModel,
    runnableFunction,
    ...payload
  });

  return result;
};
