const express = require('express');

const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(viewsController.alerts);

router.get('/', authController.isLoggedIn, viewsController.getOverview);
router.get(
  '/tour/:slug',
  authController.isLoggedIn,
  viewsController.getTourDetail
);

router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/signup', authController.isLoggedIn, viewsController.getSignupForm);
router.get('/me', authController.loginProtect, viewsController.getAccount);
router.get(
  '/my-tours',
  authController.loginProtect,
  viewsController.getMyTours
);

router.post(
  '/submit-user-data',
  authController.loginProtect,
  viewsController.updateUserData
);

module.exports = router;
