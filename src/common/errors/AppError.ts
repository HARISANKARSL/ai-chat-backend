class AppError extends Error {
  statusCode: number;
  errorCode: string;
  showToast: boolean;

  constructor(
    message: string,
    statusCode: number,
    errorCode: string,
    showToast = true
  ) {
    super(message);

    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.showToast = showToast;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;