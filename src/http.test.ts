import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { HttpClient } from './http.js';
import {
  AuthenticationError,
  NotFoundError,
  RateLimitError,
  ServerError,
  ValidationError,
  AgentGramError,
} from './errors.js';

function mockFetch(response: {
  ok?: boolean;
  status?: number;
  json?: () => Promise<unknown>;
}) {
  return vi.fn().mockResolvedValue({
    ok: response.ok ?? true,
    status: response.status ?? 200,
    json: response.json ?? (() => Promise.resolve({ success: true, data: {} })),
  });
}

describe('HttpClient', () => {
  let originalFetch: typeof globalThis.fetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('should make GET requests with correct headers', async () => {
    const fetchMock = mockFetch({
      json: () => Promise.resolve({ success: true, data: { id: '1' } }),
    });
    globalThis.fetch = fetchMock;

    const client = new HttpClient({
      baseUrl: 'https://api.test.com',
      apiKey: 'ag_testkey',
      timeout: 5000,
    });

    await client.get('/agents/me');

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.test.com/agents/me');
    expect(opts.method).toBe('GET');
    expect(opts.headers.Authorization).toBe('Bearer ag_testkey');
    expect(opts.headers['Content-Type']).toBe('application/json');
  });

  it('should omit Authorization header when apiKey is not provided', async () => {
    const fetchMock = mockFetch({
      json: () => Promise.resolve({ success: true, data: { status: 'ok' } }),
    });
    globalThis.fetch = fetchMock;

    const client = new HttpClient({
      baseUrl: 'https://api.test.com',
      timeout: 5000,
    });

    await client.get('/health');

    const [, opts] = fetchMock.mock.calls[0];
    expect(opts.headers.Authorization).toBeUndefined();
  });

  it('should make POST requests with body', async () => {
    const fetchMock = mockFetch({
      json: () => Promise.resolve({ success: true, data: { id: '2' } }),
    });
    globalThis.fetch = fetchMock;

    const client = new HttpClient({
      baseUrl: 'https://api.test.com',
      apiKey: 'ag_testkey',
      timeout: 5000,
    });

    await client.post('/posts', { title: 'Hello', content: 'World' });

    const [, opts] = fetchMock.mock.calls[0];
    expect(opts.method).toBe('POST');
    expect(opts.body).toBe(JSON.stringify({ title: 'Hello', content: 'World' }));
  });

  it('should include query parameters in GET requests', async () => {
    const fetchMock = mockFetch({
      json: () => Promise.resolve({ success: true, data: [] }),
    });
    globalThis.fetch = fetchMock;

    const client = new HttpClient({
      baseUrl: 'https://api.test.com',
      apiKey: 'ag_testkey',
      timeout: 5000,
    });

    await client.get('/posts', { sort: 'hot', limit: 10 });

    const [url] = fetchMock.mock.calls[0];
    expect(url).toContain('sort=hot');
    expect(url).toContain('limit=10');
  });

  it('should omit undefined query parameters', async () => {
    const fetchMock = mockFetch({
      json: () => Promise.resolve({ success: true, data: [] }),
    });
    globalThis.fetch = fetchMock;

    const client = new HttpClient({
      baseUrl: 'https://api.test.com',
      apiKey: 'ag_testkey',
      timeout: 5000,
    });

    await client.get('/posts', { sort: 'hot', community: undefined });

    const [url] = fetchMock.mock.calls[0];
    expect(url).toContain('sort=hot');
    expect(url).not.toContain('community');
  });

  it('should throw AuthenticationError on 401', async () => {
    globalThis.fetch = mockFetch({
      ok: false,
      status: 401,
      json: () =>
        Promise.resolve({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Invalid API key' },
        }),
    });

    const client = new HttpClient({
      baseUrl: 'https://api.test.com',
      apiKey: 'bad_key',
      timeout: 5000,
    });

    await expect(client.get('/agents/me')).rejects.toThrow(AuthenticationError);
  });

  it('should throw ValidationError on 400', async () => {
    globalThis.fetch = mockFetch({
      ok: false,
      status: 400,
      json: () =>
        Promise.resolve({
          success: false,
          error: { code: 'INVALID_INPUT', message: 'Name required' },
        }),
    });

    const client = new HttpClient({
      baseUrl: 'https://api.test.com',
      apiKey: 'ag_testkey',
      timeout: 5000,
    });

    await expect(client.post('/agents/register', {})).rejects.toThrow(ValidationError);
  });

  it('should throw NotFoundError on 404', async () => {
    globalThis.fetch = mockFetch({
      ok: false,
      status: 404,
      json: () =>
        Promise.resolve({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Post not found' },
        }),
    });

    const client = new HttpClient({
      baseUrl: 'https://api.test.com',
      apiKey: 'ag_testkey',
      timeout: 5000,
    });

    await expect(client.get('/posts/nonexistent')).rejects.toThrow(NotFoundError);
  });

  it('should throw RateLimitError on 429', async () => {
    globalThis.fetch = mockFetch({
      ok: false,
      status: 429,
      json: () =>
        Promise.resolve({
          success: false,
          error: { code: 'RATE_LIMIT', message: 'Too many requests' },
        }),
    });

    const client = new HttpClient({
      baseUrl: 'https://api.test.com',
      apiKey: 'ag_testkey',
      timeout: 5000,
    });

    await expect(client.post('/posts', {})).rejects.toThrow(RateLimitError);
  });

  it('should throw ServerError on 500', async () => {
    globalThis.fetch = mockFetch({
      ok: false,
      status: 500,
      json: () =>
        Promise.resolve({
          success: false,
          error: { code: 'INTERNAL', message: 'Server error' },
        }),
    });

    const client = new HttpClient({
      baseUrl: 'https://api.test.com',
      apiKey: 'ag_testkey',
      timeout: 5000,
    });

    await expect(client.get('/health')).rejects.toThrow(ServerError);
  });

  it('should strip trailing slash from base URL', async () => {
    const fetchMock = mockFetch({
      json: () => Promise.resolve({ success: true, data: {} }),
    });
    globalThis.fetch = fetchMock;

    const client = new HttpClient({
      baseUrl: 'https://api.test.com/',
      apiKey: 'ag_testkey',
      timeout: 5000,
    });

    await client.get('/health');

    const [url] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.test.com/health');
  });

  it('should throw on network error', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network failure'));

    const client = new HttpClient({
      baseUrl: 'https://api.test.com',
      apiKey: 'ag_testkey',
      timeout: 5000,
    });

    await expect(client.get('/health')).rejects.toThrow(AgentGramError);
  });
});
