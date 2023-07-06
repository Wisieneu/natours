const User = require('../models/userModel');

exports.signup = async (req, res, next) => {
  const newUser = User.create();
};
