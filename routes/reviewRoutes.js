const express = require('express');

const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });

router.use(authController.loginProtect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(authController.restrictTo('user'), reviewController.updateReview)
  .delete(authController.restrictTo('user'), reviewController.deleteReview);

module.exports = router;
