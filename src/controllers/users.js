const express = require("express");
const bcrypt = require("bcryptjs");
const { usersDb, todosDb } = require("../db");

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function createUserPage(req, res) {
  req.session.returnTo = "/users/create";
  res.render("users/create");
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function createUser(req, res) {
  console.log(req.file);
  const { firstName, lastName, age, role, username, password } = req.body;

  const existing = usersDb.findByUsername(username);

  if (existing) {
    console.log(`"${username}" username is used`);
    return res.send(`"${username}" username is used`);
  }

  usersDb.create({
    firstName,
    lastName,
    age,
    role,
    username,
    password: bcrypt.hashSync(password, 10),
    avatar: req.file?.filename,
  });

  req.flash("success", "Foydalanuvchi muvaffaqiyatli qo'shildi");
  res.redirect("/users/list");
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function listUsers(req, res) {
  const users = usersDb.findAll();
  res.render("users/list", { users });
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function showUser(req, res) {
  const { id } = req.params;

  const user = usersDb.findById(id);

  if (!user) {
    req.flash("warning", "Foydalanuvchi topilmadi");
    return res.redirect("/users/list");
  }

  res.render("users/show", { user });
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function editUserPage(req, res) {
  const { id } = req.params;

  const user = usersDb.findById(id);

  if (!user) {
    req.flash("warning", "Foydalanuvchi topilmadi");
    return res.redirect("/users/list");
  }

  req.session.returnTo = `/users/${id}/edit`;
  res.render("users/edit", { user, profileEdit: false });
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function editUser(req, res) {
  const { id } = req.params;
  const { firstName, lastName, age, role, username } = req.body;

  const user = usersDb.findById(id);

  if (!user) {
    req.flash("error", "Foydalanuvchi topilmadi");
    return res.redirect("/users/list");
  }

  usersDb.update(id, {
    firstName,
    lastName,
    age,
    role,
    username,
    avatar: req.file ? req.file.filename : user.avatar,
  });

  req.flash("success", "Foydalanuvchi muvaffaqiyatli tahrirlandi");
  res.redirect("/users/list");
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function removeUser(req, res) {
  const { id } = req.params;

  const user = usersDb.findById(id);

  if (!user) {
    req.flash("error", "Foydalanuvchi topilmadi");
    return res.redirect("/users/list");
  }

  usersDb.remove(id);
  todosDb.removeAllOfUser(id);

  req.flash("success", "Foydalanuvchi muvaffaqiyatli o'chirildi");
  res.redirect("/users/list");
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function userDashboard(req, res) {
  res.locals.page = null;
  res.render("users/dashboard");
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function profilePage(req, res) {
  const user = usersDb.findById(req.user.id);

  if (!user) {
    req.flash("error", "Tizimdan o'chirilgansiz");

    req.session.destroy();

    return res.redirect("/login");
  }

  res.render("users/profile", { user });
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function profileEditPage(req, res) {
  const user = usersDb.findById(req.user.id);

  if (!user) {
    req.flash("error", "Tizimdan o'chirilgansiz");

    req.session.destroy();

    return res.redirect("/login");
  }

  res.render("users/edit", { user, profileEdit: true });
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function profileEdit(req, res) {
  const userId = req.user.id;
  const { firstName, lastName, age, username } = req.body;

  const user = usersDb.findById(userId);

  if (!user) {
    req.flash("error", "Tizimdan o'chirilgansiz");

    req.session.destroy();

    return res.redirect("/login");
  }

  usersDb.update(userId, {
    firstName,
    lastName,
    age,
    username,
    avatar: req.file ? req.file.filename : user.avatar,
  });

  req.flash("success", "Foydalanuvchi muvaffaqiyatli tahrirlandi");
  res.redirect("/users/list");
}

module.exports = {
  createUserPage,
  createUser,
  listUsers,
  showUser,
  editUserPage,
  editUser,
  removeUser,
  userDashboard,
  profilePage,
  profileEditPage,
  profileEdit,
};
