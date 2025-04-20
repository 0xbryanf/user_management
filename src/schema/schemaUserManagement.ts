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
      username: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      password_hash: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      email: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      last_login: {
        type: DataTypes.DATE
      }
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
  Roles: {
    descriptor: {
      role_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      role_name: {
        type: DataTypes.TEXT
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      created_by: {
        type: DataTypes.UUID
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_by: {
        type: DataTypes.UUID
      }
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
