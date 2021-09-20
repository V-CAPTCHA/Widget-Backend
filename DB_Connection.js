require('dotenv').config();
const { Sequelize } = require('sequelize');

//initial sequelize connection
const sequelize = new Sequelize(
  process.env.DB_NAME, // DB name
  process.env.DB_USER, // user
  process.env.DB_PASS, // password
  {
    host: process.env.DB_HOST, // host
    port: process.env.DB_PORT,
    dialect: 'mysql', // 'mysql'
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//test sequelize connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

// models Import

var initModels = require('./models/init-models');
var models = initModels(sequelize);

module.exports = db;
