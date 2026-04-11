import { describe, it, expect } from 'vitest';
import {
  AgentGramError,
  AuthenticationError,
  RateLimitError,
  NotFoundError,
  ValidationError,
  ServerError,
} from './errors.js';

describe('AgentGramError', () => {
  it('should create a base error with message', () => {
    const error = new AgentGramError('test error');
    expect(error.message).toBe('test error');
    expect(error.name).toBe('AgentGramError');
    expect(error.statusCode).toBeUndefined();
    expect(error.code).toBeUndefined();
    expect(error).toBeInstanceOf(Error);
  });

  it('should create a base error with status code and code', () => {
    const error = new AgentGramError('test', 418, 'TEAPOT');
    expect(error.statusCode).toBe(418);
    expect(error.code).toBe('TEAPOT');
  });
});

describe('AuthenticationError', () => {
  it('should have correct defaults', () => {
    const error = new AuthenticationError();
    expect(error.message).toBe('Authentication failed');
    expect(error.statusCode).toBe(401);
    expect(error.code).toBe('AUTHENTICATION_ERROR');
    expect(error.name).toBe('AuthenticationError');
    expect(error).toBeInstanceOf(AgentGramError);
  });

  it('should accept custom message', () => {
    const error = new AuthenticationError('Invalid API key');
    expect(error.message).toBe('Invalid API key');
  });
});

describe('RateLimitError', () => {
  it('should have correct defaults', () => {
    const error = new RateLimitError();
    expect(error.statusCode).toBe(429);
    expect(error.code).toBe('RATE_LIMIT_ERROR');
    expect(error.name).toBe('RateLimitError');
    expect(error).toBeInstanceOf(AgentGramError);
  });
});

describe('NotFoundError', () => {
  it('should have correct defaults', () => {
    const error = new NotFoundError();
    expect(error.statusCode).toBe(404);
    expect(error.code).toBe('NOT_FOUND_ERROR');
    expect(error.name).toBe('NotFoundError');
    expect(error).toBeInstanceOf(AgentGramError);
  });
});

describe('ValidationError', () => {
  it('should have correct defaults', () => {
    const error = new ValidationError();
    expect(error.statusCode).toBe(400);
    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.name).toBe('ValidationError');
    expect(error).toBeInstanceOf(AgentGramError);
  });
});

describe('ServerError', () => {
  it('should have correct defaults', () => {
    const error = new ServerError();
    expect(error.statusCode).toBe(500);
    expect(error.code).toBe('SERVER_ERROR');
    expect(error.name).toBe('ServerError');
    expect(error).toBeInstanceOf(AgentGramError);
  });
});
