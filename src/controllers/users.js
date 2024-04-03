const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../db/User");

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

  return User.findOne({ where: { username } })
    .then((existing) => {
      if (existing) {
        req.flash("warning", `"${username}" username is used`);
        return res.redirect("/users/create");
      }

      return bcrypt
        .hash(password, 10)
        .then((hashedPwd) => {
          return User.create({
            firstName,
            lastName,
            age,
            role,
            username,
            password: hashedPwd,
            avatar: req.file?.filename,
          })
            .then(() => {
              req.flash("success", "Foydalanuvchi muvaffaqiyatli qo'shildi");
              res.redirect("/users/list");
            })
            .catch((err) => {
              console.log("error creating user: ", err);
              res.flash("error", err.message);
              res.redirect("/users/create");
            });
        })
        .catch((err) => {
          console.log("error hashing password: ", err);
          res.flash("error", err.message);
          res.redirect("/users/create");
        });
    })
    .catch((err) => {
      console.log("error finding user by username: ", err);
      res.flash("error", err.message);
      res.redirect("/users/create");
    });
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function listUsers(req, res) {
  return User.findAll({ order: [["createdAt", "DESC"]] })
    .then((users) => {
      res.render("users/list", { users });
    })
    .catch((err) => {
      console.log("error finding all users: ", err);
      req.flash("error", err.message);
      res.redirect("/");
    });
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function showUser(req, res) {
  const { id } = req.params;

  return User.findByPk(id).then((user) => {
    console.log({ user });

    if (!user) {
      req.flash("warning", "Foydalanuvchi topilmadi");
      return res.redirect("/users/list");
    }

    res.render("users/show", { user });
  });
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function editUserPage(req, res) {
  const { id } = req.params;

  return User.findByPk(id).then((user) => {
    console.log({ user });

    if (!user) {
      req.flash("warning", "Foydalanuvchi topilmadi");
      return res.redirect("/users/list");
    }

    req.session.returnTo = `/users/${id}/edit`;
    res.render("users/edit", { user, profileEdit: false });
  });
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function editUser(req, res) {
  const { id } = req.params;
  const { firstName, lastName, age, role, username } = req.body;

  return User.findByPk(id)
    .then((user) => {
      console.log({ user });

      if (!user) {
        req.flash("warning", "Foydalanuvchi topilmadi");
        return res.redirect("/users/list");
      }

      return user
        .update({
          firstName,
          lastName,
          age,
          role,
          username,
          avatar: req.file ? req.file.filename : user.avatar,
        })
        .then(() => {
          req.flash("success", "Foydalanuvchi muvaffaqiyatli tahrirlandi");
          res.redirect("/users/list");
        })
        .catch((err) => {
          console.log("error updating user: ", err);
          req.flash("error", err.message);
          res.redirect("/users/list");
        });
    })
    .catch((err) => {
      console.log("error finding user by id: ", err);
      req.flash("error", err.message);
      res.redirect("/users/list");
    });
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function removeUser(req, res) {
  const { id } = req.params;

  return User.findByPk(id).then((user) => {
    console.log({ user });

    if (!user) {
      req.flash("warning", "Foydalanuvchi topilmadi");
      return res.redirect("/users/list");
    }

    user.destroy();

    req.flash("success", "Foydalanuvchi muvaffaqiyatli o'chirildi");
    res.redirect("/users/list");
  });
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
  return User.findByPk(req.user.id).then((user) => {
    if (!user) {
      req.flash("error", "Tizimdan o'chirilgansiz");

      req.session.destroy();

      return res.redirect("/login");
    }

    res.render("users/profile", { user });
  });
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function profileEditPage(req, res) {
  return User.findByPk(req.user.id).then((user) => {
    if (!user) {
      req.flash("error", "Tizimdan o'chirilgansiz");

      req.session.destroy();

      return res.redirect("/login");
    }

    res.render("users/edit", { user, profileEdit: true });
  });
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function profileEdit(req, res) {
  const { firstName, lastName, age, username } = req.body;

  return User.findByPk(req.user.id).then((user) => {
    if (!user) {
      req.flash("error", "Tizimdan o'chirilgansiz");

      req.session.destroy();

      return res.redirect("/login");
    }

    return user
      .update({
        firstName,
        lastName,
        age,
        username,
        avatar: req.file ? req.file.filename : user.avatar,
      })
      .then(() => {
        req.flash("success", "Foydalanuvchi muvaffaqiyatli tahrirlandi");
        res.redirect("/users/list");
      });
  });
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
