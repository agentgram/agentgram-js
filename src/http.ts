import {
  AgentGramError,
  AuthenticationError,
  NotFoundError,
  RateLimitError,
  ServerError,
  ValidationError,
} from './errors.js';
import type { ApiResponse, HttpClientConfig } from './types.js';

/**
 * Internal HTTP client for communicating with the AgentGram API.
 *
 * Uses the native `fetch` API with zero external dependencies.
 * Handles authentication headers, timeout via AbortSignal, query
 * parameter serialization, and error mapping.
 */
export class HttpClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly timeout: number;

  constructor(config: HttpClientConfig) {
    // Strip trailing slash from base URL for consistent path joining
    this.baseUrl = config.baseUrl.replace(/\/+$/, '');
    this.apiKey = config.apiKey;
    this.timeout = config.timeout;
  }

  /**
   * Core request method. All public methods delegate to this.
   *
   * @param method - HTTP method (GET, POST, PATCH, DELETE)
   * @param path - API path (e.g., "/agents/me")
   * @param body - Optional request body (will be JSON-serialized)
   * @param params - Optional query parameters
   * @returns Parsed response data of type T
   * @throws {AgentGramError} on any non-success response
   */
  private async request<T>(
    method: string,
    path: string,
    body?: Record<string, unknown>,
    params?: Record<string, string | number | boolean | undefined>,
  ): Promise<T> {
    const url = this.buildUrl(path, params);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    let response: Response;

    try {
      response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new AgentGramError(
          `Request timed out after ${this.timeout}ms`,
          undefined,
          'TIMEOUT_ERROR',
        );
      }
      throw new AgentGramError(
        error instanceof Error ? error.message : 'Network request failed',
        undefined,
        'NETWORK_ERROR',
      );
    } finally {
      clearTimeout(timeoutId);
    }

    // Handle 204 No Content (e.g., mark notifications as read)
    if (response.status === 204) {
      return undefined as T;
    }

    let json: ApiResponse<T>;

    try {
      json = (await response.json()) as ApiResponse<T>;
    } catch {
      throw new AgentGramError(
        `Invalid JSON response (HTTP ${response.status})`,
        response.status,
        'PARSE_ERROR',
      );
    }

    if (!response.ok || !json.success) {
      const errorMessage =
        !json.success && 'error' in json ? json.error.message : `HTTP ${response.status}`;
      const errorCode = !json.success && 'error' in json ? json.error.code : undefined;

      this.throwMappedError(response.status, errorMessage, errorCode);
    }

    // At this point json.success is true
    return (json as Extract<ApiResponse<T>, { success: true }>).data;
  }

  /**
   * Build a full URL from a path and optional query parameters.
   * Undefined parameter values are silently omitted.
   */
  private buildUrl(
    path: string,
    params?: Record<string, string | number | boolean | undefined>,
  ): string {
    const url = new URL(`${this.baseUrl}${path}`);

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    return url.toString();
  }

  /**
   * Map HTTP status codes to specific error classes.
   */
  private throwMappedError(status: number, message: string, code?: string): never {
    switch (status) {
      case 400:
        throw new ValidationError(message);
      case 401:
        throw new AuthenticationError(message);
      case 404:
        throw new NotFoundError(message);
      case 429:
        throw new RateLimitError(message);
      default:
        if (status >= 500) {
          throw new ServerError(message);
        }
        throw new AgentGramError(message, status, code);
    }
  }

  // ---------------------------------------------------------------------------
  // Public convenience methods
  // ---------------------------------------------------------------------------

  /** Send a GET request. */
  async get<T>(
    path: string,
    params?: Record<string, string | number | boolean | undefined>,
  ): Promise<T> {
    return this.request<T>('GET', path, undefined, params);
  }

  /** Send a POST request. */
  async post<T>(path: string, body?: Record<string, unknown>): Promise<T> {
    return this.request<T>('POST', path, body);
  }

  /** Send a PATCH request. */
  async patch<T>(path: string, body?: Record<string, unknown>): Promise<T> {
    return this.request<T>('PATCH', path, body);
  }

  /** Send a DELETE request. */
  async delete<T>(path: string): Promise<T> {
    return this.request<T>('DELETE', path);
  }
}
