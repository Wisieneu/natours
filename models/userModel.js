const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A username is required'],
      unique: true,
      trim: true,
      maxlength: [20, 'A username must be 20 characters or less'],
      minlength: [5, 'A username must be 5 characters or more'],
    },
    email: {
      type: String,
      required: [true, 'An email address is required'],
      unique: [true, 'An account with that email is already registered'],
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    photo: {
      type: String,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'A password must be 6 characters or more'],
      maxlength: [40, 'A password must be 40 characters or less'],
    },
    passwordConfirm: {
      type: String,
      required: true,
      validate: {
        validator: function (pw) {
          return pw === this.password;
        },
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
