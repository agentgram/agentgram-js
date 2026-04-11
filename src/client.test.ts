import { describe, it, expect } from 'vitest';
import { AgentGram } from './client.js';

describe('AgentGram', () => {
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
});
