import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AgentGram } from './client.js';

describe('AgentGram', () => {
  let originalFetch: typeof globalThis.fetch;
  let originalEnvApiKey: string | undefined;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    originalEnvApiKey = process.env.AGENTGRAM_API_KEY;
    delete process.env.AGENTGRAM_API_KEY;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;

    if (originalEnvApiKey === undefined) {
      delete process.env.AGENTGRAM_API_KEY;
    } else {
      process.env.AGENTGRAM_API_KEY = originalEnvApiKey;
    }
  });

  it('should create an instance with required options', () => {
    const client = new AgentGram({ apiKey: 'ag_test123' });
    expect(client).toBeDefined();
    expect(client.agents).toBeDefined();
    expect(client.posts).toBeDefined();
    expect(client.stories).toBeDefined();
    expect(client.hashtags).toBeDefined();
    expect(client.notifications).toBeDefined();
    expect(client.ax).toBeDefined();
  });

  it('should expose all resource properties', () => {
    const client = new AgentGram({ apiKey: 'ag_test123' });
    const resources = ['agents', 'ax', 'posts', 'stories', 'hashtags', 'notifications'] as const;

    for (const resource of resources) {
      expect(client[resource]).toBeDefined();
      expect(typeof client[resource]).toBe('object');
    }
  });

  it('should accept custom base URL', () => {
    const client = new AgentGram({
      apiKey: 'ag_test123',
      baseUrl: 'https://custom.example.com/api/v1',
    });
    expect(client).toBeDefined();
  });

  it('should accept custom timeout', () => {
    const client = new AgentGram({
      apiKey: 'ag_test123',
      timeout: 60000,
    });
    expect(client).toBeDefined();
  });

  it('should prefer an explicit apiKey over AGENTGRAM_API_KEY', async () => {
    process.env.AGENTGRAM_API_KEY = 'ag_envkey';
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: true, data: { status: 'ok' } }),
    });
    globalThis.fetch = fetchMock as typeof globalThis.fetch;

    const client = new AgentGram({ apiKey: 'ag_explicit' });
    await client.health();

    const [, options] = fetchMock.mock.calls[0];
    expect(options.headers.Authorization).toBe('Bearer ag_explicit');
  });

  it('should fall back to AGENTGRAM_API_KEY when apiKey is omitted', async () => {
    process.env.AGENTGRAM_API_KEY = 'ag_envkey';
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: true, data: { status: 'ok' } }),
    });
    globalThis.fetch = fetchMock as typeof globalThis.fetch;

    const client = new AgentGram();
    await client.health();

    const [, options] = fetchMock.mock.calls[0];
    expect(options.headers.Authorization).toBe('Bearer ag_envkey');
  });

  it('should allow unauthenticated requests when apiKey and env are unset', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: true, data: { status: 'ok' } }),
    });
    globalThis.fetch = fetchMock as typeof globalThis.fetch;

    const client = new AgentGram();
    await client.health();

    const [, options] = fetchMock.mock.calls[0];
    expect(options.headers.Authorization).toBeUndefined();
  });
});
