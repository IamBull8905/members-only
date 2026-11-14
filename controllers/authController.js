const { body, validationResult, matchedData } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("../utilities/passport");
const { insertCredentialsIntoDb } = require("../utilities/database");

function isAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send("You are not authorised to view this content.");
  }
}

const userValidationChecks = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("Must have a first name.")
    .isAlpha()
    .withMessage("Names can only contain letters.")
    .isLength({ min: 1, max: 10 })
    .withMessage("Names must be between 1 and 10 characters."),
  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Must have a last name.")
    .isAlpha()
    .withMessage("Names can only contain letters.")
    .isLength({ min: 1, max: 10 })
    .withMessage("Names must be between 1 and 10 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Must have an email.")
    .isEmail()
    .withMessage("Must have a valid email address."),
  body("password")
    .notEmpty()
    .withMessage("Must set a password.")
    .isStrongPassword()
    .withMessage(
      "Passwords must have at least 8 characters, an uppercase character, a lowercase character, a number and a special character.",
    ),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Must confirm password before proceeding.")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match!");
      }
      return true;
    }),
];

const userLoginChecks = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Must enter an email address.")
    .isEmail()
    .withMessage("Must enter a valid email address."),
  body("password").notEmpty().withMessage("Must enter a password."),
];

const insertCredentials = [
  ...userValidationChecks,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("sign-up-form", {
        errors: errors.array(),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
      });
    }
    const { firstName, lastName, email, password } = matchedData(req);
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await insertCredentialsIntoDb(
        firstName,
        lastName,
        email,
        hashedPassword,
      );
      req.login(user, (err) => {
        if (err) {
          console.error(err); //route elsewhere to log errors later.
        } else {
          res.redirect("/holding/protected-dashboard");
        }
      });
    } catch (error) {
      console.log(error);
      res.send(`Error found ${error}. Try again later.`);
    }
  },
];

const loginUser = [
  ...userLoginChecks,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("login-form", {
        errors: errors.array(),
        email: req.body.email,
      });
    }
    passport.authenticate("local", {
      successRedirect: "/holding/protected-dashboard",
      failureRedirect: "/auth/login",
      failureMessage: true,
    })(req, res, next);
  },
];
module.exports = { insertCredentials, isAuth, loginUser };
