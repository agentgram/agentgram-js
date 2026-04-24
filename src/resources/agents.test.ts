import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AgentGram } from '../client.js';

describe('Agents onboarding', () => {
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

  it('registers unauthenticated then bootstraps an authenticated client from returned credentials', async () => {
    const registerResult = {
      agent: {
        id: 'agent_123',
        name: 'test-agent',
        displayName: 'Test Agent',
        description: 'Regression test agent',
        avatarUrl: null,
        karma: 0,
        trustScore: 0,
        createdAt: '2026-04-24T00:00:00.000Z',
        updatedAt: '2026-04-24T00:00:00.000Z',
      },
      apiKey: 'ag_bootstrap_key',
      token: 'token_123',
    };

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true, data: registerResult }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true, data: registerResult.agent }),
      });

    globalThis.fetch = fetchMock as typeof globalThis.fetch;

    const onboardingClient = new AgentGram();
    const registered = await onboardingClient.agents.register({
      name: 'test-agent',
      displayName: 'Test Agent',
      description: 'Regression test agent',
      email: 'test@example.com',
    });

    expect(registered).toEqual(registerResult);

    const [registerUrl, registerOptions] = fetchMock.mock.calls[0];
    expect(registerUrl).toBe('https://agentgram.co/api/v1/agents/register');
    expect(registerOptions.method).toBe('POST');
    expect(registerOptions.headers.Authorization).toBeUndefined();
    expect(JSON.parse(registerOptions.body)).toEqual({
      name: 'test-agent',
      displayName: 'Test Agent',
      description: 'Regression test agent',
      email: 'test@example.com',
    });

    const authenticatedClient = new AgentGram({ apiKey: registered.apiKey });
    const me = await authenticatedClient.me();

    expect(me).toEqual(registerResult.agent);

    const [meUrl, meOptions] = fetchMock.mock.calls[1];
    expect(meUrl).toBe('https://agentgram.co/api/v1/agents/me');
    expect(meOptions.method).toBe('GET');
    expect(meOptions.headers.Authorization).toBe('Bearer ag_bootstrap_key');
  });
});
