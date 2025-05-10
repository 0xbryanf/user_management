import { Sequelize } from "sequelize";
import { SQLCONNECTIONS } from "types/sequelize";
import fs from "fs";
import "dotenv/config";
import { DatabaseConfigInterface } from "types/databaseConfig";

const SQL_CONNECTION: SQLCONNECTIONS = {};
const { DB_DATABASE, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

/**
 * Validates that the required environment variables for the database connection are set.
 * If any of the required variables are missing, an error is thrown.
 */
const validateEnvVariables = () => {
  if (!DB_DATABASE || !DB_USERNAME || !DB_PASSWORD || !DB_HOST || !DB_PORT) {
    throw new Error("Missing required environment variables");
  }
};

/**
 * Configures and returns a Sequelize instance for the provided database configuration.
 * If a Sequelize instance for the given configuration already exists, it will be returned.
 * Otherwise, a new Sequelize instance will be created, authenticated, and stored for future use.
 */
export const sequelizeDatabaseConfig = async (
  databaseConfig: DatabaseConfigInterface
): Promise<Sequelize> => {
  try {
    const databaseKey = JSON.stringify(databaseConfig);
    if (!SQL_CONNECTION[databaseKey]) {
      console.log("Creating new Sequelize instance");
      const sequelize = new Sequelize(databaseConfig);
      await sequelize.authenticate();
      console.log("Database connection established");
      SQL_CONNECTION[databaseKey] = sequelize;
    }
    return SQL_CONNECTION[databaseKey];
  } catch (error) {
    console.error("Error during database connection:", error);
    throw error;
  }
};

/**
 * Configures and returns a Sequelize instance for the provided database configuration.
 * If a Sequelize instance for the given configuration already exists, it will be returned.
 * Otherwise, a new Sequelize instance will be created, authenticated, and stored for future use.
 */
export const sequelizeConnectionUp = async (): Promise<Sequelize> => {
  validateEnvVariables();

  const databaseConfig: DatabaseConfigInterface = {
    database: DB_DATABASE!,
    username: DB_USERNAME!,
    password: DB_PASSWORD!,
    host: DB_HOST!,
    port: Number(DB_PORT),
    dialect: "postgres" as const,
    logging: false,
    connectionTimeout: 5000,
    pool: {
      max: 5,
      min: 0,
      acquire: 120000,
      idle: 10000
    }
  };

  if (process.env.USE_SSL === "true") {
    databaseConfig.dialectOptions = {
      ssl: {
        require: true,
        ca: fs.readFileSync("path/to/your/ca.crt").toString(),
        rejectUnauthorized: false
      }
    };
  }

  return await sequelizeDatabaseConfig(databaseConfig);
};

/**
 * Closes all active database connections managed by the Sequelize instance.
 * This function should be called when the application is shutting down to ensure
 * all database connections are properly closed.
 */
export const sequelizeConnectionDown = async (): Promise<void> => {
  try {
    await Promise.all(
      Object.values(SQL_CONNECTION).map((connection) => connection.close())
    );
    console.log("Database connections closed");
  } catch (error) {
    console.error("Error closing database connections:", error);
    throw error;
  }
};
