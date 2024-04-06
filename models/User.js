const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const User = sequelize.define('User', {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  accessRole: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isIn: [[1, 2, 3]]
    }
  },
  imageURL: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  phoneNumber: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  createdOn: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedOn: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
tableName: 'User',
  timestamps: false 
});

User.beforeSave((user, options) => {
    user.updatedOn = new Date(); 
  });


module.exports = User;
