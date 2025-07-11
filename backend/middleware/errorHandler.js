// Global error handling middleware
const errorHandler = (err, req, res) => {
  console.error('Error:', err);

  // Default error
  let error = {
    statusCode: err.statusCode || 500,
    message: err.message || 'Internal Server Error'
  };

  // MySQL errors
  if (err.code) {
    switch (err.code) {
      case 'ER_DUP_ENTRY':
        error.statusCode = 400;
        if (err.message.includes('email')) {
          error.message = 'Email address already exists';
        } else {
          error.message = 'Duplicate entry found';
        }
        break;
      case 'ER_NO_REFERENCED_ROW_2':
        error.statusCode = 400;
        error.message = 'Referenced record does not exist';
        break;
      case 'ER_BAD_FIELD_ERROR':
        error.statusCode = 400;
        error.message = 'Invalid field in query';
        break;
      case 'ER_PARSE_ERROR':
        error.statusCode = 400;
        error.message = 'Database query syntax error';
        break;
      case 'ECONNREFUSED':
        error.statusCode = 503;
        error.message = 'Database connection failed';
        break;
      default:
        error.statusCode = 500;
        error.message = 'Database error occurred';
    }
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.statusCode = 401;
    error.message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    error.statusCode = 401;
    error.message = 'Token expired';
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    error.statusCode = 400;
    error.message = err.message;
  }

  // File upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    error.statusCode = 400;
    error.message = 'File size too large';
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    error.statusCode = 400;
    error.message = 'Too many files or unexpected field name';
  }

  // Send error response
  res.status(error.statusCode).json({
    error: error.message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      details: err
    })
  });
};

export default errorHandler;
