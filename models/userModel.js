const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A username is required.'],
    unique: true,
    trim: true,
    maxlength: [20, 'A username must be 20 characters or less.'],
    minlength: [5, 'A username must be 5 characters or more.'],
  },
  email: {
    type: String,
    required: [true, 'An email address is required.'],
    unique: [true, 'An account with that email is already registered.'],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email.'],
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    minlength: [6, 'A password must be 6 characters or more.'],
    maxlength: [40, 'A password must be 40 characters or less.'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      // only works on .save() and .create()
      validator: function (pw) {
        return pw === this.password;
      },
      message: 'Passwords do not match.',
    },
  },
  passwordLastChangedAt: Date,

  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  // Delete passwordConfirm field from database containing the raw unencrypted password
  this.passwordConfirm = undefined;
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordLastChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.isPasswordCorrect = async function (candidatePw, userPw) {
  return await bcrypt.compare(candidatePw, userPw);
};

userSchema.methods.changedPasswordAfter = function (JTWTimestamp) {
  if (this.passwordLastChangedAt) {
    const passwordChangedAt = parseInt(
      this.passwordLastChangedAt.getTime() / 1000,
      10
    );
    return JTWTimestamp < passwordChangedAt; // false (reject req) if pw changed before the request has been sent
  }
  return false;
};

userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes = 600 000 ms

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
