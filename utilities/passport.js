const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const { pgPool } = require("./database");

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (username, password, done) => {
      try {
        const { rows } = await pgPool.query(
          "SELECT * FROM users WHERE email = $1",
          [username],
        );
        const user = rows[0];
        if (!user) {
          return done(null, false, { message: "Account not found" });
        }
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
          return done(null, false, { message: "Incorrect username or password" });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pgPool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    const user = rows[0];

    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
