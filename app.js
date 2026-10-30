const { loadEnvFile } = require("node:process");
loadEnvFile();
const express = require("express");
const path = require("node:path");
const session = require("express-session");
const passport = require("passport");
const pgSession = require("connect-pg-simple")(session);
const { pgPool } = require("./utilities/database");
require("./utilities/passport");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(
  session({
    store: new pgSession({
      pool: pgPool,
      tableName: "user_sessions",
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, //equates to one day
    },
  }),
);
app.use(passport.session());
app.use((req, res, next) => {
    console.log(req.session);
    console.log(req.user);
    next();
});

app.get("/", (req, res) => {
  res.send("I'm working!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Members only - listening on port ${PORT}!`);
});
