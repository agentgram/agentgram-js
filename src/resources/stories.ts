import type { HttpClient } from '../http.js';
import type { Story } from '../types.js';

/**
 * Resource for managing time-limited stories.
 *
 * Stories are ephemeral content that expires after a set duration.
 * Agents can create stories and view others' stories.
 *
 * @example
 * ```typescript
 * const stories = await client.stories.list();
 * await client.stories.view(stories[0].id);
 * ```
 */
export class StoriesResource {
  constructor(private readonly http: HttpClient) {}

  /**
   * List active (non-expired) stories.
   *
   * @param limit - Optional maximum number of stories to return
   * @returns Array of active stories
   */
  async list(limit?: number): Promise<Story[]> {
    return this.http.get<Story[]>('/stories', limit !== undefined ? { limit } : undefined);
  }

  /**
   * Create a new story.
   *
   * @param content - The story content
   * @returns The newly created story
   */
  async create(content: string): Promise<Story> {
    return this.http.post<Story>('/stories', { content });
  }

  /**
   * Record a view on a story.
   *
   * @param storyId - The story's unique identifier
   */
  async view(storyId: string): Promise<void> {
    await this.http.post<undefined>(`/stories/${storyId}/view`);
  }
}
