import { assignRole } from "functions/assignRole";
import { checkUsername } from "functions/checkUsername";
import { createRole } from "functions/createRole";
import { createUser } from "functions/createUser";
import { sendOTPEmail } from "functions/sendOTPEmail";
import { testRedisConnection } from "functions/testRedisConnection";
import { verifyOTPEmail } from "functions/verifyOTPEmail";
import { verifyUser } from "functions/verifyUser";
import { DataTypes } from "sequelize";

export const SchemaUserManagement = {
  Users: {
    descriptor: {
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      last_login: {
        type: DataTypes.DATE,
        allowNull: true
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: true
      },
      updated_by: {
        type: DataTypes.UUID,
        allowNull: true
      },
      deleted_by: {
        type: DataTypes.UUID,
        allowNull: true
      }
    },
    modelOptions: {
      tableName: "users",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      paranoid: true,
      deletedAt: "deleted_at",
      underscored: true
    },
    relation: {},
    actions: {
      createUser,
      verifyUser,
      checkUsername,
      sendOTPEmail,
      testRedisConnection,
      verifyOTPEmail
    }
  },
  Credentials: {
    descriptor: {
      credential_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(254),
        allowNull: false,
        unique: true
      },
      password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: true
      },
      updated_by: {
        type: DataTypes.UUID,
        allowNull: true
      },
      deleted_by: {
        type: DataTypes.UUID,
        allowNull: true
      }
    },
    modelOptions: {
      tableName: "credentials",
      timestamps: true, // adds created_at & updated_at
      createdAt: "created_at",
      updatedAt: "updated_at",
      paranoid: true, // adds deleted_at
      deletedAt: "deleted_at",
      underscored: true, // snake_case columns
      indexes: [
        {
          unique: true,
          fields: ["email"],
          name: "uq_credentials_email"
        },
        {
          fields: ["user_id"],
          name: "idx_credentials_user_id"
        }
      ]
    },
    relation: {},
    actions: {}
  },
  Roles: {
    descriptor: {
      role_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      role_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: true
      },
      updated_by: {
        type: DataTypes.UUID,
        allowNull: true
      },
      deleted_by: {
        type: DataTypes.UUID,
        allowNull: true
      }
    },
    modelOptions: {
      tableName: "roles",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      paranoid: true,
      deletedAt: "deleted_at",
      underscored: true
    },
    relation: {},
    actions: {
      createRole,
      assignRole
    }
  },
  UserRoles: {
    descriptor: {
      user_role_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      role_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: true
      },
      updated_by: {
        type: DataTypes.UUID,
        allowNull: true
      },
      deleted_by: {
        type: DataTypes.UUID,
        allowNull: true
      }
    },
    modelOptions: {
      tableName: "user_roles",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      paranoid: true,
      deletedAt: "deleted_at",
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ["user_id", "role_id"],
          name: "uq_user_roles_user_id_role_id"
        }
      ]
    },
    relation: {},
    actions: {}
  }
};
