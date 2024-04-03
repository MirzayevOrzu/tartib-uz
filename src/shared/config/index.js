require("dotenv").config();

module.exports = {
  port: process.env.PORT,
  session: {
    secret: process.env.SESSION_SECRET,
    duration: +process.env.SESSION_DURATION,
  },
  db: {
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    pwd: process.env.DB_PWD,
  },
};
