
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorResponse = {
      success: false,
      errors: errors.array(),
    };
    return res.status(400).json(errorResponse);
  }
  next();
};