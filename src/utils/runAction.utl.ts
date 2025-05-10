import { ActionTree } from "schema";
import { loadSchemaModel } from "../schema/loadSchemaModel.utl";

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
