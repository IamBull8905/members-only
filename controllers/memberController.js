const { body, validationResult, matchedData } = require("express-validator");
const { updateMembershipStatusInDb } = require("../utilities/database");
const { loadEnvFile } = require("node:process");
loadEnvFile();

const submittedPasswordChecks = [
  body("memberPassword")
    .trim()
    .notEmpty()
    .withMessage("Submitted password cannot be left empty."),
];

const updateMembership = [
  ...submittedPasswordChecks,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("become-member-form", {
        errors: errors.array(),
      });
    }
    const { memberPassword } = matchedData(req);
    if (memberPassword === process.env.MEMBERSHIP_PASSWORD) {
      await updateMembershipStatusInDb(req.user.id);
      res.redirect("/holding/protected-dashboard");
    } else {
      return res.status(403).render("become-member-form", {
        errors: [
          {
            type: "field",
            value: req.body.memberPassword,
            msg: "Incorrect membership password",
            location: "body",
          },
        ],
      });
    }
  },
];

module.exports = { updateMembership };
