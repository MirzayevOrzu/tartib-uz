const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../db/User");

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function loginPage(req, res) {
  req.session.returnTo = "/login";

  res.render("auth/login", {
    layout: "layouts/auth",
  });
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function login(req, res) {
  const { username, password } = req.body;

  return User.findOne({ where: { username } }).then((existing) => {
    if (!existing) {
      req.flash("error", "Login yoki parol xato");

      return res.redirect("/login");
    }

    return bcrypt.compare(password, existing.password).then((match) => {
      if (!match) {
        req.flash("error", "Login yoki parol xato");

        return res.redirect("/login");
      }

      req.session.user = existing;

      req.flash("success", "Xush kelibsiz!");

      res.redirect("/");
    });
  });
}

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function logout(req, res) {
  req.session.destroy();

  res.redirect("/login");
}

module.exports = {
  loginPage,
  login,
  logout,
};
