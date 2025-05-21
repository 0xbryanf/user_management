import { camelToSnake } from "lib/helpers/camelToSnake";
import { ActionTree } from "schema";
import * as Sequelize from "sequelize";
import { SchemaModels } from "types/schemaModels";
import { sequelizeConnectionUp } from "../utils/sequelizeConnection.utl";
/**
 * Utilities for dynamically loading and caching Sequelize models
 * from schema/action tree definitions.
 */
export const schemaModel: {
  [key: string]: { [key: string]: Sequelize.ModelStatic<Sequelize.Model> };
} = {};

/**
 * Generates a unique key for a schema-model pair.
 */
export const getModelKey = (schema: string, model: string) => {
  return `${schema}_${model}`;
};

/**
 * Returns the model cache key based on remoteUrl (or "default").
 */
export const getModelCacheKey = (
  options: { remoteUrl?: string; timestamps?: boolean } = {}
) => {
  return options?.remoteUrl ? options.remoteUrl : "default";
};

/**
 * Defines and caches a Sequelize model for the given schema and model.
 * @throws If the model definition is not found in ActionTree.
 * @returns The Sequelize model.
 */
export const populateDataModel = async (
  schema: string,
  model: string,
  options: { remoteUrl?: string; timestamps?: boolean } = {}
) => {
  const key = getModelKey(schema, model);
  const cacheKey = getModelCacheKey(options);

  const modelData = ActionTree[schema]?.[model];
  if (!modelData) {
    throw new Error(`Model not found: ${schema}.${model}`);
  }

  const descriptor = modelData.descriptor;
  const sequelize = await sequelizeConnectionUp();

  if (!schemaModel[cacheKey]) {
    schemaModel[cacheKey] = {};
  }

  try {
    const metadata: any = {
      schema: (schema as string).toLowerCase(),
      tableName: camelToSnake(model as string),
      freezeTableName: true,
      underscored: true,
      timestamps: options?.timestamps ?? true
    };

    if (metadata.timestamps) {
      metadata.createdAt = descriptor.created_at ? "created_at" : undefined;
      metadata.updatedAt = descriptor.updated_at ? "updated_at" : undefined;
    }

    schemaModel[cacheKey][key] = sequelize.define(
      schema as string,
      descriptor,
      metadata
    );

    return schemaModel[cacheKey][key];
  } catch (err) {
    console.log("Error while defining model:", err);
    throw err;
  }
};

/**
 * Loads a Sequelize model for the given schema and model from cache,
 * or defines it if not already cached.
 */
export const loadSchemaModel = async <
  S extends keyof SchemaModels,
  M extends keyof SchemaModels[S]
>(
  schema: S,
  model: M,
  options: { remoteUrl?: string; timestamps?: boolean } = {}
) => {
  const key = getModelKey(schema as string, model as string);
  const cacheKey = getModelCacheKey(options);

  if (!schemaModel[cacheKey]) {
    schemaModel[cacheKey] = {};
  }

  if (!schemaModel[cacheKey][key]) {
    await populateDataModel(schema as string, model as string, options);
  }

  return schemaModel[cacheKey][key];
};
