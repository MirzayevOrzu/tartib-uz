const { Sequelize } = require("sequelize");

const db = new Sequelize({
  dialect: "postgres",
  host: "localhost",
  port: 5432,
  database: "erp-guide-n6",
  username: "postgres",
  password: "1234",
});

module.exports = db;
