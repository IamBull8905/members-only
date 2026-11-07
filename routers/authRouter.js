const { Router } = require("express");
const { insertCredentials } = require("../controllers/authController");

const authRouter = Router();

authRouter.get("/sign-up", (req, res) => {
  res.render("sign-up-form");
});

authRouter.post("/sign-up", insertCredentials)

module.exports = { authRouter };
