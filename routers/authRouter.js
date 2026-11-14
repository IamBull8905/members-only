const { Router } = require("express");
const {
  insertCredentials,
  loginUser,
} = require("../controllers/authController");

const authRouter = Router();

authRouter.get("/sign-up", (req, res) => {
  res.render("sign-up-form");
});

authRouter.post("/sign-up", insertCredentials);

authRouter.get("/login", (req, res) => {
  const errors = req.session.messages || [];
  req.session.messages = [];
  res.render("login-form");
});

authRouter.post("/login", loginUser);

authRouter.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    } else {
      res.redirect("/");
    }
  });
});

module.exports = { authRouter };
