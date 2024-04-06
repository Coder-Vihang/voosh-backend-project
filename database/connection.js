var pg = require('pg');
pg.defaults.ssl = true;
const { Sequelize } = require('sequelize');
const {DatabaseKeys}=require('../config');

const sequelize = new Sequelize(DatabaseKeys.Database, DatabaseKeys.UserName, DatabaseKeys.Password, {
  host: DatabaseKeys.Host,
  dialect: DatabaseKeys.Dialect,
  pool: {
    max: 2, 
    min: 0, 
    acquire: 30000, 
    idle: 10000 
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

module.exports = sequelize;
