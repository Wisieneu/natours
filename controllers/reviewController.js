const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const Review = require('../models/reviewModel');
const Tour = require('../models/tourModel');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
  const reviewId = req.params.id;
  if (!reviewId)
    return next(new AppError('Please provide a valid review ID.', 400));

  const review = await Review.findById(reviewId);
  if (!review)
    return next(
      new AppError('Could not find a review with the provided ID.', 404)
    );

  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const { review, rating, tour } = req.body;
  const user = req.user.id;

  if (!(await Tour.findById(tour)))
    return next(new AppError('Could not find a tour with the provided Id.'));

  const newReview = await Review.create({ review, rating, tour, user });

  res.status(201).json({
    status: 'success',
    data: {
      newReview,
    },
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {});

exports.deleteReview = catchAsync(async (req, res, next) => {});
