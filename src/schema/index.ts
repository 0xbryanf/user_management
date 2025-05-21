import { ActionTreeType, Tree } from "types/tree";
import { SchemaUserManagement } from "./schemaUserManagement";
/**
 * Builds the ActionTree object containing all user management schema actions.
 *
 * The ActionTree organizes available operations and schema definitions
 * for the User_Management module.
 */
const createActionTree: Tree = (schema) => schema;
/**
 * Action tree for the application, mapping schemas to their actions.
 */
export const ActionTree: ActionTreeType = createActionTree({
  User_Management: SchemaUserManagement
});
