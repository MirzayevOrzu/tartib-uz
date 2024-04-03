const { DataTypes } = require("sequelize");
const db = require("./");
const Guide = require("./Guide");
const User = require("./User");

const Todo = db.define(
  "Todo",
  {
    completed: {
      type: DataTypes.BOOLEAN,
      default: false,
    },
  },
  {
    tableName: "todos",
    timestamps: true,
  }
);

Todo.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Todo, { foreignKey: "userId", as: "user" });

Todo.belongsTo(Guide, { foreignKey: "guideId", as: "guide" });
Guide.hasMany(Todo, { foreignKey: "guideId", as: "guide" });

// Guide.belongsToMany(User, { through: Todo, onDelete: "CASCADE" });
// User.belongsToMany(Guide, { through: Todo, onDelete: "CASCADE" });
// User.hasMany(Todo, { foreignKey: "userId" });
// Guide.hasMany(Todo, { foreignKey: "guideId" });

module.exports = Todo;
