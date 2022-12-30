exports.invalidData = (
  {
    res,
    statusCode,
    error = "Invalid request"
  }) => {
  res.status(statusCode || 400).json(
    error,
  )
}