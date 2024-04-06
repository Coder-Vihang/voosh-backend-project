const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const TokenDetails = sequelize.define('tokenDetails', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'User', 
      key: 'userId'
    },
    index: true
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  createdOn: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updatedOn: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'tokenDetails', 
  timestamps: false 
});

module.exports = TokenDetails;
