function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(error, req, res, next) {
  console.error(error);
  if (error.message === 'This browser origin is not allowed by CORS.') {
    return res.status(403).json({ message: error.message });
  }
  if (error.name === 'ValidationError') {
    return res.status(400).json({ message: Object.values(error.errors).map((item) => item.message).join(' ') });
  }
  if (error.code === 11000) {
    return res.status(409).json({ message: 'A record with this value already exists.' });
  }
  return res.status(error.status || 500).json({ message: error.message || 'Something went wrong on the server.' });
}

module.exports = { notFound, errorHandler };
