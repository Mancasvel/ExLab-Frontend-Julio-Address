import { Model } from 'sequelize'

const loadModel = (sequelize, DataTypes) => {
  class ShippingAddress extends Model {
    static associate (models) {
      ShippingAddress.belongsTo(models.User, { foreignKey: 'userId', as: 'user' })
    }
  }

  ShippingAddress.init({
    alias: {
      allowNull: false,
      type: DataTypes.STRING
    },
    street: {
      allowNull: false,
      type: DataTypes.STRING
    },
    city: {
      allowNull: false,
      type: DataTypes.STRING
    },
    province: {
      allowNull: false,
      type: DataTypes.STRING
    },
    zipCode: {
      allowNull: false,
      type: DataTypes.STRING
    },
    isDefault: {
      allowNull: false,
      type: DataTypes.BOOLEAN
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'ShippingAddress'
  })

  return ShippingAddress
}

export default loadModel
