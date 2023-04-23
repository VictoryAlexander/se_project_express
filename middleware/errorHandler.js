const errorHandler = (err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
}

module.exports = errorHandler;