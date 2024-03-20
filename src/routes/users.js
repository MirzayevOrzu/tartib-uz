const express = require("express");
const {
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
} = require("../controllers/users");
const isLoggedIn = require("../shared/middlewares/is-logged-in");
const hasRole = require("../shared/middlewares/has-role");
const validate = require("../shared/middlewares/validate");
const {
  createUserSchema,
  editUserSchema,
  editMeSchema,
} = require("../schemas/users");
const upload = require("../shared/upload");

const router = express.Router();

router.use((req, res, next) => {
  res.locals.page = "users";
  next();
});

router.get("/", isLoggedIn, userDashboard);
router.get("/users/create", isLoggedIn, hasRole(["admin"]), createUserPage);
router.post(
  "/users/create",
  isLoggedIn,
  hasRole(["admin"]),
  upload.single("avatar"),
  validate(createUserSchema),
  createUser
);
router.get("/users/list", isLoggedIn, hasRole(["admin"]), listUsers);
router.get("/users/profile", isLoggedIn, profilePage);
router.get("/users/:id", isLoggedIn, hasRole(["admin"]), showUser);
router.get("/users/profile/edit", isLoggedIn, profileEditPage);
router.post(
  "/users/profile/edit",
  isLoggedIn,
  upload.single("avatar"),
  validate(editMeSchema),
  profileEdit
);
router.get("/users/:id/edit", isLoggedIn, hasRole(["admin"]), editUserPage);
router.post(
  "/users/:id/edit",
  isLoggedIn,
  hasRole(["admin"]),
  upload.single("avatar"),
  validate(editUserSchema),
  editUser
);
router.post("/users/:id/delete", isLoggedIn, hasRole(["admin"]), removeUser);

module.exports = router;
