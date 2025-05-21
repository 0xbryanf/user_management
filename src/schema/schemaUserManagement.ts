import { activateAuthorization } from "functions/activateAuthorization.fn";
import { activateUser } from "functions/activateUser.fn";
import { assignRole } from "functions/assignRole.fn";
import { createAuthorization } from "functions/createAuthorization.fn";
import { createRole } from "functions/createRole.fn";
import { getAuthorization } from "functions/getAuthorization.fn";
import { getCredentialByEmail } from "functions/getCredentialByEmail.fn";
import { getCredentialByUserId } from "functions/getCredentialByUserId.fn";
import { registerInitCredentials } from "functions/registerInitCredentials.fn";
import { requestEmailConfirmation } from "functions/requestEmailConfirmation.fn";
import { sendOTPEmail } from "functions/sendOneTimePinToEmail.fn";
import { updateAuthorization } from "functions/updateAuthorization.fn";
import { updatePassword } from "functions/updatePassword.fn";
import { verifyCredentials } from "functions/verifyCredentials.fn";
import { verifyOTPEmail } from "functions/verifyOTPEmail.fn";
import { verifyUserActivation } from "functions/verifyUserActivation.fn";
import { DataTypes } from "sequelize";
/**
 * Schema definitions for user management entities, including
 * Users, Roles, UserRoles, OAuthProviders, Credentials, and PasswordHistory.
 *
 * Each schema contains:
 *  - descriptor: Field definitions and types
 *  - actions: Available data operations for the schema
 *  - modelOptions: Table options (if applicable)
 *  - relation: Entity relationships (currently empty)
 */
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
      activateUser,
      createAuthorization,
      getAuthorization,
      activateAuthorization,
      verifyUserActivation,
      updateAuthorization
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
      created_by: {
        type: DataTypes.UUID,
        allowNull: true
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updated_by: {
        type: DataTypes.UUID,
        allowNull: true
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true
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
    actions: {
      updatePassword
    }
  }
};
