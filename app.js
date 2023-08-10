const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

const app = express();

app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// Dev logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from the same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 10 * 60 * 1000,
  message: 'You are being rate limited on this IP.',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Implement CORS
app.use(cors());
// Access-Control-Allow-Origin *
// Example:
// api.domain.com => front-end on domain.com
// app.use(cors({ origin: 'https://www.domain.com' }))

app.options('*', cors());

// Data sanitization against XSS
app.use(xss());

// Prevent HTTP parameter polution
app.use(
  hpp({
    whitelist: [
      'duration',
      'difficulty',
      'ratingsQuanity',
      'ratingsAverage',
      'maxGroupSize',
      'price',
    ],
  })
);

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(compression());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// ROUTES

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/', viewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
