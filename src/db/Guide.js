const { DataTypes } = require("sequelize");
const db = require("./");

const Guide = db.define(
  "Guide",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
  },
  {
    tableName: "guides",
    timestamps: true,
  }
);

module.exports = Guide;
