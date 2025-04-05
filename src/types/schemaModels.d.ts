export interface SchemaModels {
  [key: string]: {
    [key: string]: Model<any, any>;
  };
}
