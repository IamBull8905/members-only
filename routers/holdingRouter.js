const { Router } = require("express");
const { isAuth } = require("../controllers/authController");
const { updateMembership } = require("../controllers/memberController");
const holdingRouter = Router();

holdingRouter.get("/protected-dashboard", isAuth, (req, res) => {
  res.render("dashboard");
});

holdingRouter.get("/membership-portal", isAuth, (req, res) => {
  if (req.user.membership_status === "Member") {
    res.send("You are already a member!");
  } else {
    res.render("become-member-form");
  }
});

holdingRouter.post("/membership-portal", isAuth, updateMembership);

module.exports = { holdingRouter };
