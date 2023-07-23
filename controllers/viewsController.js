const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
  const tours = await Tour.find();
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTourDetail = catchAsync(async (req, res) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate(
    'reviews'
  );
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});
