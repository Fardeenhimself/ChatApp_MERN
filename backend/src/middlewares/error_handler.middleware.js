const { StatusCodes } = require("http-status-codes");

function errorHandlerMiddleware(err, req, res, next) {
  console.log(err);
  const customError = {
    msg: err.message,
    status: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  };
  if (err.name == "ValidationError") {
    customError.msg = Object.values(err.errors)
      .map((value) => {
        return value.message;
      })
      .join(", ");

    customError.status = StatusCodes.BAD_REQUEST;
  }

  if (err.code == 11000) {
    customError.msg = `Duplicate values entered for ${Object.keys(
      err.keyValue
    )}, Enter a different values`;
    customError.status = StatusCodes.BAD_REQUEST;
  }

  res.status(customError.status).json({ msg: customError.msg });
}

module.exports = errorHandlerMiddleware;
