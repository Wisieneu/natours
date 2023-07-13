const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

const Review = require('../models/reviewModel');
const Tour = require('../models/tourModel');

exports.getAllReviews = factory.getAll(Review, {
  path: 'tour',
  select: '-guides name',
});

exports.setTourUserIds = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  if (!(await Tour.findById(req.body.tour)))
    return next(new AppError('Could not find a tour with the provided Id.'));

  next();
});

exports.getReview = factory.getOne(Review, {
  path: 'tour',
  select: '-guides name',
});
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.createReview = factory.createOne(Review);
