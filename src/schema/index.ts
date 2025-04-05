import { ActionTreeType, Tree } from "types/tree";
import { SchemaUserManagement } from "./schemaUserManagement";

const createActionTree: Tree = (schema) => schema;

export const ActionTree: ActionTreeType = createActionTree({
  User_Management: SchemaUserManagement
});
