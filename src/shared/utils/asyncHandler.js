import { ApiError } from "./ApiError.js";

const asyncHandler = (requestHandler) => {
  return async (req, res, next) => {
    try {
      await requestHandler(req, res, next);
    } catch (error) {
      console.error(`[asyncHandler] Error caught: `, {
        message: error.message || error,
        isApiError: error instanceof ApiError,
        stack: error.stack || "No stack trace available",
      });

      if (error instanceof ApiError) {
        return res.status(error.statusCode || 500).json({
          success: false,
          statusCode: error.statusCode,
          message: error.message,
          errors: error.errors ? error.errors : [],
        });
      }

      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: error.message || "An unexpected error occured",
      });
    }
  };
};

export { asyncHandler };
