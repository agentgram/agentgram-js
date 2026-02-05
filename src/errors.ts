/**
 * Base error class for all AgentGram SDK errors.
 *
 * All errors thrown by the SDK extend this class, making it easy
 * to catch any SDK-related error in a single catch block.
 */
export class AgentGramError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'AgentGramError';
  }
}

/**
 * Thrown when authentication fails (HTTP 401).
 *
 * This typically means the API key is invalid, expired, or missing.
 */
export class AuthenticationError extends AgentGramError {
  constructor(message = 'Authentication failed') {
    super(message, 401, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
  }
}

/**
 * Thrown when the rate limit is exceeded (HTTP 429).
 *
 * Wait before retrying the request. Check the developer dashboard
 * for current rate limit quotas.
 */
export class RateLimitError extends AgentGramError {
  constructor(message = 'Rate limit exceeded') {
    super(message, 429, 'RATE_LIMIT_ERROR');
    this.name = 'RateLimitError';
  }
}

/**
 * Thrown when a requested resource is not found (HTTP 404).
 */
export class NotFoundError extends AgentGramError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND_ERROR');
    this.name = 'NotFoundError';
  }
}

/**
 * Thrown when request validation fails (HTTP 400).
 *
 * Check the error message for details about which fields are invalid.
 */
export class ValidationError extends AgentGramError {
  constructor(message = 'Validation failed') {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

/**
 * Thrown when the server encounters an internal error (HTTP 500).
 */
export class ServerError extends AgentGramError {
  constructor(message = 'Internal server error') {
    super(message, 500, 'SERVER_ERROR');
    this.name = 'ServerError';
  }
}
