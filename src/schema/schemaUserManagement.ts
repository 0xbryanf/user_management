import { activateUser } from "functions/activateUser";
import { assignRole } from "functions/assignRole";
import { createRole } from "functions/createRole";
import { getCredentialByEmail } from "functions/getCredentialByEmail";
import { getCredentialByUserId } from "functions/getCredentialByUserId";
import { registerInitCredentials } from "functions/registerInitCredentials";
import { requestEmailConfirmation } from "functions/requestEmailConfirmation";
import { sendOTPEmail } from "functions/sendOTPEmail";
import { verifyCredentials } from "functions/verifyCredentials";
import { verifyOTPEmail } from "functions/verifyOTPEmail";
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
        defaultValue: false
      },
      last_login: {
        type: DataTypes.DATE,
        allowNull: true
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: true
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      updated_by: {
        type: DataTypes.UUID,
        allowNull: true
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      deleted_by: {
        type: DataTypes.UUID,
        allowNull: true
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    relation: {},
    actions: {
      activateUser
    }
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
      created_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      updated_by: {
        type: DataTypes.UUID,
        allowNull: true
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      deleted_by: {
        type: DataTypes.UUID,
        allowNull: true
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true
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
      created_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      updated_by: {
        type: DataTypes.UUID,
        allowNull: true
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      deleted_by: {
        type: DataTypes.UUID,
        allowNull: true
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    modelOptions: {
      tableName: "user_roles",
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
  },
  OAuthProviders: {
    descriptor: {
      oauth_provider_id: {
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
        allowNull: false
      },
      provider: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      provider_user_id: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      email_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: true
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      updated_by: {
        type: DataTypes.UUID,
        allowNull: true
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      deleted_by: {
        type: DataTypes.UUID,
        allowNull: true
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    modelOptions: {
      tableName: "oauth_providers",
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ["provider", "provider_user_id"],
          name: "uq_oauth_providers_provider_user"
        },
        {
          fields: ["user_id"],
          name: "idx_oauth_providers_user_id"
        }
      ]
    },
    relation: {},
    actions: {}
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
      created_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      updated_by: {
        type: DataTypes.UUID,
        allowNull: true
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      deleted_by: {
        type: DataTypes.UUID,
        allowNull: true
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    modelOptions: {
      tableName: "credentials",
      underscored: true,
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
    actions: {
      registerInitCredentials,
      getCredentialByEmail,
      getCredentialByUserId,
      requestEmailConfirmation,
      verifyCredentials,
      sendOTPEmail,
      verifyOTPEmail
    }
  },
  PasswordHistory: {
    descriptor: {
      password_history_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      credential_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      changed_by: {
        type: DataTypes.UUID,
        allowNull: true
      },
      changed_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    },
    modelOptions: {
      tableName: "password_history",
      underscored: true,
      indexes: [
        {
          fields: ["user_id"],
          name: "idx_password_history_user_id"
        },
        {
          fields: ["credential_id"],
          name: "idx_password_history_credential_id"
        }
      ]
    },
    relation: {},
    actions: {}
  }
};
