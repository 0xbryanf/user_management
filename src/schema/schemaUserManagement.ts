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
      updated_by: {
        type: DataTypes.UUID
      },
      deleted_by: {
        type: DataTypes.UUID
      }
    },
    modelOptions: {
      tableName: "users",
      timestamps: true,
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
  Credentials: {},
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
      id: {
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
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    relation: {},
    actions: {}
  }
};
