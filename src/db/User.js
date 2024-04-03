const { DataTypes } = require("sequelize");
const db = require("./");

const User = db.define(
  "User",
  {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM,
      values: ["admin", "employee", "superAdmin"],
      defaultValue: "employee",
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING(60),
    },
  },
  {
    tableName: "users",
    timestamps: true,
  }
);

module.exports = User;
