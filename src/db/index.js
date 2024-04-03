const { Sequelize } = require("sequelize");
const config = require("../shared/config");

const db = new Sequelize({
  dialect: "postgres",
  host: config.db.host,
  port: config.db.port,
  database: config.db.name,
  username: config.db.user,
  password: config.db.pwd,
});

module.exports = db;
