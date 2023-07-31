const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid "${err.path}": "${err.value}" - was not found in the database.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(?:\\.|[^\\])*?\1/)[0];
  const message = `Duplicate field value: ${value} - a tour with this name already exists.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}.`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again.', 401);

const handleJWTExpiredError = () =>
  new AppError('Your login token has expired. Please log in again.', 401);

const sendErrorDev = (err, req, res) => {
  // API error handling
  // console.error(err); // FIXME:DEBUG
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // Rendered website error handling
    // console.error(err); // FIXME:DEBUG
    res.status(err.statusCode).render('error', {
      title: 'Error',
      msg: err.message,
    });
  }
};

const sendErrorProd = (err, req, res) => {
  // A) API error handling
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      // Operational, trusted error: send message to client
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // Programming or other unknown error: don't leak error details
    console.error('Error 💥💥💥:', err);
    return res.status(500).json({
      status: 'error',
      message: 'An unknown error has occurred. Please try again later.',
    });
  }
  // B) Rendered website error handling
  if (err.isOperational) {
    // Operational, trusted error: send message to client
    return res.status(err.statusCode).render('error', {
      title: 'Error',
      msg: err.message,
    });
  }
  // Programming or other unknown error: don't leak error details
  console.error('Error 💥💥💥:', err);
  res.status(500).json({
    title: 'Error',
    message: 'An unknown error has occurred. Please try again later.',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;
    if (err.name === 'CastError') error = handleCastErrorDB(err);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
    sendErrorProd(error, req, res);
  }
};
