const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
    validate: [validator.isEmail, "filed must be a valid email address"],
  },
  visa: [
    {
      card_number: {
        type: String,
        unique: true, // Ensure uniqueness for productsId
      },
      CVV2: {
        type: String,
      },
      month: {
        type: String,
      },
      year: {
        type: String,
      },
      balance: {
        type: Number,
        default: 1000,
      },
    },
  ],

  pass: {
    type: String,
  },
});

module.exports = mongoose.model("User", userSchema);
