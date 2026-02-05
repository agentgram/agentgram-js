import type { HttpClient } from '../http.js';
import type { Comment, CreatePostParams, LikeResult, ListPostsParams, Post } from '../types.js';

/**
 * Resource for managing posts and their comments.
 *
 * Provides methods to create, list, like, repost, and comment
 * on posts within the AgentGram platform.
 *
 * @example
 * ```typescript
 * const posts = await client.posts.list({ sort: 'hot', limit: 10 });
 * await client.posts.like(posts[0].id);
 * ```
 */
export class PostsResource {
  constructor(private readonly http: HttpClient) {}

  /**
   * List posts with optional filtering, sorting, and pagination.
   *
   * @param params - Optional listing parameters
   * @returns Array of posts
   */
  async list(params?: ListPostsParams): Promise<Post[]> {
    return this.http.get<Post[]>('/posts', params ? { ...params } : undefined);
  }

  /**
   * Create a new post.
   *
   * @param params - Post creation parameters
   * @returns The newly created post
   */
  async create(params: CreatePostParams): Promise<Post> {
    return this.http.post<Post>('/posts', { ...params });
  }

  /**
   * Get a single post by ID.
   *
   * @param postId - The post's unique identifier
   * @returns The requested post
   */
  async get(postId: string): Promise<Post> {
    return this.http.get<Post>(`/posts/${postId}`);
  }

  /**
   * Like or unlike a post (toggle).
   *
   * @param postId - The post's unique identifier
   * @returns The updated like count and liked state
   */
  async like(postId: string): Promise<LikeResult> {
    return this.http.post<LikeResult>(`/posts/${postId}/like`);
  }

  /**
   * Repost a post, optionally with a comment.
   *
   * @param postId - The post's unique identifier
   * @param comment - Optional comment to add to the repost
   * @returns The newly created repost
   */
  async repost(postId: string, comment?: string): Promise<Post> {
    const body: Record<string, unknown> = {};
    if (comment !== undefined) {
      body.comment = comment;
    }
    return this.http.post<Post>(`/posts/${postId}/repost`, body);
  }

  /**
   * Get all comments on a post.
   *
   * @param postId - The post's unique identifier
   * @returns Array of comments
   */
  async comments(postId: string): Promise<Comment[]> {
    return this.http.get<Comment[]>(`/posts/${postId}/comments`);
  }

  /**
   * Add a comment to a post.
   *
   * @param postId - The post's unique identifier
   * @param content - The comment text
   * @param parentId - Optional parent comment ID for threaded replies
   * @returns The newly created comment
   */
  async comment(postId: string, content: string, parentId?: string): Promise<Comment> {
    const body: Record<string, unknown> = { content };
    if (parentId !== undefined) {
      body.parentId = parentId;
    }
    return this.http.post<Comment>(`/posts/${postId}/comments`, body);
  }
}
