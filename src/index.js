const express = require("express");
const path = require("node:path");
const session = require("express-session");
const expressEjsLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const config = require("./shared/config");
const routes = require("./routes");
const db = require("./db");

const app = express();
const SequelizeStore = require("connect-session-sequelize")(session.Store);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layouts/main");

app.use("/static", express.static(path.join(__dirname, "..", "public")));
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use(expressEjsLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    name: "session_id",
    secret: config.session.secret,
    saveUninitialized: false,
    resave: false,
    cookie: {
      httpOnly: true, // faqat http o'qiy oladi, javascript o'qiy olmaydi, xavfsizlik uchun
      maxAge: config.session.duration, // qancha vaqt session davom etsin
    },
    store: new SequelizeStore({
      db,
      tableName: "sessions",
      expiration: config.session.duration,
    }),
  })
);
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.warning = req.flash("warning");

  next();
});

app.use(routes);

app.use((req, res) => {
  res.render("not-found", { layout: "layouts/auth" });
});

db.sync({ alter: true })
  .then(() => {
    console.log("DB connection is established");

    app.listen(config.port, () => {
      console.log(`Listening on port ${config.port}`);
    });
  })
  .catch((err) => {
    console.log("DB connection is failed: ", err);
  });
