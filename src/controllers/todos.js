const express = require("express");
const User = require("../db/User");
const Guide = require("../db/Guide");
const Todo = require("../db/Todo");

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function createTodoPage(req, res) {
  return Promise.all([
    User.findAll({ raw: true }),
    Guide.findAll({ raw: true }),
  ]).then(([users, guides]) => {
    res.render("todos/create", { users, guides });
  });
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function createTodo(req, res) {
  const { userId, guideId } = req.body;

  return Promise.all([
    User.findByPk(userId, { raw: true }),
    Guide.findByPk(guideId, { raw: true }),
  ]).then(([user, guide]) => {
    if (!user) {
      req.flash("error", "Foydalanuvchi topilmadi");

      return res.redirect("/todos/create");
    }

    if (!guide) {
      req.flash("error", "Tartib topilmadi");

      return res.redirect("/todos/create");
    }

    return Todo.create({ userId, guideId }).then(() => {
      req.flash("success", "Bildirishnoma yaratildi");

      res.redirect("/todos/list");
    });
  });
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function listTodos(req, res) {
  return Todo.findAll({
    where: { userId: req.user.id },
    include: [
      { model: User, as: "user" },
      { model: Guide, as: "guide" },
    ],
    raw: true,
    nest: true,
  }).then((todos) => {
    res.render("todos/list", { todos });
  });
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function showTodo(req, res) {
  const { id } = req.params;

  return Todo.findOne({
    where: { id, userId: req.user.id },
    include: ["user", "guide"],
  }).then((todo) => {
    if (!todo) {
      req.flash("warning", "Bildirishnoma topilmadi");

      return res.redirect("/todos/list");
    }

    res.render("todos/show", { todo });
  });
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function completeTodo(req, res) {
  const { id } = req.params;

  return Todo.findOne({
    where: { id, userId: req.user.id },
  }).then((todo) => {
    if (!todo) {
      req.flash("error", "Bildirishnoma topilmadi");

      return res.redirect("/todos/list");
    }

    if (todo.completed) {
      req.flash("error", "Bildirishnoma bilan allaqachon tanishib chiqilgan");

      return res.redirect("/todos/list");
    }

    return todo.update({ completed: true }).then(() => {
      res.redirect("/todos/list");
    });
  });
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function removeTodo(req, res) {
  const { id } = req.params;

  Todo.findByPk(id).then((todo) => {
    if (!todo) {
      req.flash("error", "Bildirishnoma topilmadi");

      return res.redirect("/todos/list");
    }

    return todo.destroy().then(() => {
      res.redirect("/todos/list");
    });
  });
}

module.exports = {
  createTodoPage,
  createTodo,
  listTodos,
  showTodo,
  completeTodo,
  removeTodo,
};
