const httpStatusText = require("../utils/httpStatusText");
const appError = require("../utils/appError");
const asyncWrapper = require("../middelwares/asyncWrapper");
const { validationResult } = require("express-validator");
const UserDB = require("../models/user.model");

const AccountRegister = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = appError.create(errors.array(), 401, httpStatusText.ERROR);
    return next(err);
  }

  const { name, email, pass, phone, visa } = req.body;

  const oldUserEmail = await UserDB.findOne({ email: email });
  if (oldUserEmail) {
    const err = appError.create("user already exist", 400, httpStatusText.FAIL);
    return next(err);
  }

  const oldUserName = await UserDB.findOne({ name: name });
  if (oldUserName) {
    const err = appError.create(
      "username already exist",
      400,
      httpStatusText.FAIL
    );
    return next(err);
  }

  const newUser = new UserDB({
    name,
    phone,
    email,
    visa,
    pass,
  });

  await newUser.save();

  res.status(201).json({ status: httpStatusText.SUCCESS, newUser });
});

const AccountLogin = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = appError.create(errors.array(), 401, httpStatusText.ERROR);
    return next(err);
  }

  const { email, pass } = req.body;

  try {
    const user = await UserDB.findOne({ email });

    if (!user || pass !== user.pass) {
      const err = appError.create(
        "Invalid email or password",
        400,
        httpStatusText.FAIL
      );
      return next(err);
    }

    res.json({ status: httpStatusText.SUCCESS, user });
  } catch (error) {
    console.error("Error in account login:", error);
    const err = appError.create(
      "Internal server error",
      500,
      httpStatusText.ERROR
    );
    return next(err);
  }
});

const Accountpay = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = appError.create(errors.array(), 401, httpStatusText.ERROR);
    return next(err);
  }

  const { card_number, CVV2, month, year, price } = req.body;

  try {
    if (!card_number || !CVV2 || !month || !year || !price) {
      const err = appError.create("Provide all data", 400, httpStatusText.FAIL);
      return next(err);
    }

    const user = await UserDB.findOne({ "visa.card_number": card_number });

    if (
      !user ||
      user.visa[0].CVV2 !== CVV2 ||
      user.visa[0].month !== month ||
      user.visa[0].year !== year
    ) {
      res.json({ status: httpStatusText.FAIL });
    } else {
      if (price == 0) {
        res.json({
          status: httpStatusText.FAIL,
          message: "Nothing selected to buy",
        });
      }
      if (price <= user.visa[0].balance) {
        user.visa[0].balance = user.visa[0].balance - price;
        // Save the updated user document with the new balance
        await user.save();
        res.json({ status: httpStatusText.SUCCESS, User: user });
      } else {
        res.json({
          status: httpStatusText.FAIL,
          message: "Not enough balance",
        });
      }
    }
  } catch (error) {
    console.error("Error in payment verification:", error);
    const err = appError.create(
      "Internal server error",
      500,
      httpStatusText.ERROR
    );
    return next(err);
  }
});

module.exports = {
  AccountRegister,
  AccountLogin,
  Accountpay,
};
