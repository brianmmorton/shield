
export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.TEXT,
      field: 'phone_number'
    },
    timezone: {
      type: DataTypes.TEXT,
    },
    provider: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    avatarUrl: {
      type: DataTypes.TEXT,
      field: 'avatar_url',
      allowNull: true
    },
  }, {
    tableName: 'users',
    updatedAt: 'updated_at',
    createdAt: 'created_at',

    indexes: [
      {
        name: 'user_email_uniq',
        unique: true,
        method: 'BTREE',
        fields: ['email']
      }
    ],

    classMethods: {
      associate: () => {}
    }
  })

  return User
}
