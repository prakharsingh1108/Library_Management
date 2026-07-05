class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    console.log(err);

    if (err.code === 11000) {
        err = new ErrorHandler("Duplicate Field Value Entered", 400);
    }

    if (err.name === "JsonWebTokenError") {
        err = new ErrorHandler("JSON Web Token is Invalid. Try Again.", 400);
    }

    if (err.name === "TokenExpiredError") {
        err = new ErrorHandler("JSON Web Token has Expired. Try Again.", 400);
    }

    if (err.name === "CastError") {
        err = new ErrorHandler(
            `Resource Not Found. Invalid: ${err.path}`,
            400
        );
    }

    const errorMessage = err.errors
        ? Object.values(err.errors)
              .map((error) => error.message)
              .join(", ")
        : err.message;

    return res.status(err.statusCode).json({
        success: false,
        message: errorMessage,
    });
};

export default ErrorHandler;