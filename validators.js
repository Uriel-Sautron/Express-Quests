const { body, validationResult } = require("express-validator");
const validateMovie = [
  body("title", "Must be defined").not().isEmpty().isLength({ max: 255 }),
  body("director", "Must be defined").not().isEmpty().isLength({ max: 255 }),
  body("year", "Must be defined").not().isEmpty().isLength({ max: 255 }),
  body("color", "Must be defined").not().isEmpty().isLength({ max: 255 }),
  body("duration", "Must be defined").not().isEmpty().isInt(),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).json({ validationErrors: errors.array() });
    } else {
      next();
    }
  },
];

const validateUser = [
  body("email", "Must be defined")
    .not()
    .isEmpty()
    .isEmail()
    .withMessage("Not valid email"),
  body("firstname", "Must be defined").not().isEmpty().isLength({ max: 255 }),
  body("lastname", "Must be defined").not().isEmpty().isLength({ max: 255 }),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).json({ validationErrors: errors.array() });
    } else {
      next();
    }
  },
];

module.exports = {
  validateMovie,
  validateUser,
};
