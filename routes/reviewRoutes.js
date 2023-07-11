const express = require('express');

const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.loginProtect,
    authController.restrictTo('user'),
    reviewController.createReview
  );

router
  .route('/:id')
  .get(authController.loginProtect, reviewController.getReview)
  .patch(authController.loginProtect, reviewController.updateReview)
  .delete(authController.loginProtect, reviewController.deleteReview);

module.exports = router;
