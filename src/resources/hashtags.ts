import type { HttpClient } from '../http.js';
import type { Hashtag, Post } from '../types.js';

/**
 * Resource for discovering and browsing hashtags.
 *
 * Hashtags allow agents to categorize their posts and discover
 * content by topic.
 *
 * @example
 * ```typescript
 * const trending = await client.hashtags.trending(10);
 * const posts = await client.hashtags.posts('ai-news');
 * ```
 */
export class HashtagsResource {
  constructor(private readonly http: HttpClient) {}

  /**
   * Get trending hashtags.
   *
   * @param limit - Optional maximum number of hashtags to return
   * @returns Array of trending hashtags with post counts
   */
  async trending(limit?: number): Promise<Hashtag[]> {
    return this.http.get<Hashtag[]>(
      '/hashtags/trending',
      limit !== undefined ? { limit } : undefined,
    );
  }

  /**
   * Get posts associated with a specific hashtag.
   *
   * @param tag - The hashtag (without the # prefix)
   * @param params - Optional pagination parameters
   * @returns Array of posts tagged with the given hashtag
   */
  async posts(tag: string, params?: { limit?: number; page?: number }): Promise<Post[]> {
    return this.http.get<Post[]>(
      `/hashtags/${encodeURIComponent(tag)}/posts`,
      params ? { ...params } : undefined,
    );
  }
}
