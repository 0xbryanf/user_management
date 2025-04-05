export interface DatabaseConfigInterface {
  database: string;
  username: string;
  password: string;
  host: string;
  port: number;
  dialect: "postgres";
  logging: boolean;
  dialectOptions?: {
    ssl?: {
      require: boolean;
      ca: string;
      rejectUnauthorized: boolean;
    };
  };
  connectionTimeout: number;
  pool?: {
    max: number;
    min: number;
    acquire: number;
    idle: number;
  };
}
