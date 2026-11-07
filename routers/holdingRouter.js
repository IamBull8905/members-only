const { Router } = require("express");
const { isAuth } = require("../controllers/authController");
const holdingRouter = Router();

holdingRouter.get("/protected-dashboard", isAuth, (req, res) => {
  res.send("Renders the logged in account's dashboard.");
});

module.exports = { holdingRouter };