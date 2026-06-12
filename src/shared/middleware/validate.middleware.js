import { ApiError } from "../utils/index.js";

const formatError = (issues) => {
  const errors = {};
  for (const issue of issues) {
    errors[issue.path[0]] = issue.message;
  }

  return errors;
};

export const validateBody = (schema) => {
  return (req, res, next) => {
    const validation = schema.safeParse(req.body);

    if (!validation.success) {
      const issues = formatError(validation.error.issues);
      return next(new ApiError(400, "Invalid registration data", issues));
    }

    req.body = validation.data;
    next();
  };
};
