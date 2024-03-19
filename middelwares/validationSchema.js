const { body } = require("express-validator");

const userRegisterValidationSchema = () => {
  return [
    body("name").notEmpty().withMessage("Name is required"),
    body("phone").notEmpty().withMessage("Phone is required"),
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format"),
    body("pass").notEmpty().withMessage("Password is required"),
    body("visa")
      .isArray()
      .withMessage("Visa must be an array")
      .notEmpty()
      .withMessage("Visa array cannot be empty"),
  ];
};

const userLoginValidationSchema = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format"),
    body("pass").notEmpty().withMessage("Password is required"),
  ];
};

const userPayValidationSchema = () => {
  return [
    body("card_number").notEmpty().withMessage("Invalid card_number format"),
    body("CVV2").notEmpty().withMessage("Invalid CVV2 format"),
    body("month").notEmpty().withMessage("Invalid month format"),
    body("year").notEmpty().withMessage("Invalid year format"),
  ];
};
module.exports = {
  userRegisterValidationSchema,
  userLoginValidationSchema,
  userPayValidationSchema,
};
