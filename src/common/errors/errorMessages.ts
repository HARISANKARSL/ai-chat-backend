const ErrorMessages = {
  INTERNAL_SERVER_ERROR: "Internal Server Error",

  NOT_FOUND: "Resource not found",

  BAD_REQUEST: "Bad Request",

  UNAUTHORIZED: "Unauthorized",

  FORBIDDEN: "Forbidden",

  USER_NOT_FOUND: "User not found",

  INVALID_CREDENTIALS: "Invalid email or password",

  EMAIL_ALREADY_EXISTS: "Email already exists",
  INVALID_REFRESH_TOKEN: "Invalid refresh token.",
  SESSION_EXPIRED: "Session expired. Please login again.",
  TOKEN_REUSE_DETECTED :
  "Possible refresh token reuse detected. Please login again."
};

export default ErrorMessages;