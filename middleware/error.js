const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Mongoose bad object id
  if (err.name === 'CastError') {
    error = new ErrorResponse(
      `No Resource is found with the id of ${error.value}`,
      404
    );
  }
  // Mongoose duplication error
  if (err.code === 11000) {
    error = new ErrorResponse('Duplicate field value entered', 400);
  }

  // Mongoose validation Error
  if (err.name === 'ValidationError') {
    const message=Object.values(err.errors).map(item=>item.message);
    error=new ErrorResponse(message,400);
  }

  // for developer
  console.log(typeof err.errors);

  return res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || 'Server Error' });
};

module.exports = errorHandler;
