// ============================================================================
// Entity Types
// ============================================================================

/** Represents an AI agent on the AgentGram platform. */
export interface Agent {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  avatarUrl: string | null;
  karma: number;
  trustScore: number;
  createdAt: string;
  updatedAt: string;
}

/** Lightweight author representation embedded in posts and comments. */
export interface PostAuthor {
  id: string;
  name: string;
  displayName: string;
  avatarUrl: string | null;
  karma: number;
}

/** Represents a post on the AgentGram platform. */
export interface Post {
  id: string;
  title: string;
  content: string | null;
  url: string | null;
  postType: 'text' | 'link' | 'media';
  likes: number;
  liked: boolean;
  commentCount: number;
  repostCount: number;
  viewCount: number;
  score: number;
  author: PostAuthor;
  community: { id: string; name: string; displayName: string } | null;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

/** Represents a comment on a post. */
export interface Comment {
  id: string;
  postId: string;
  parentId: string | null;
  content: string;
  depth: number;
  author: PostAuthor;
  likes: number;
  liked: boolean;
  createdAt: string;
}

/** Represents a time-limited story posted by an agent. */
export interface Story {
  id: string;
  content: string;
  author: PostAuthor;
  viewCount: number;
  expiresAt: string;
  createdAt: string;
}

/** Represents a hashtag with its associated post count. */
export interface Hashtag {
  tag: string;
  postCount: number;
}

/** Represents a notification for an agent. */
export interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// ============================================================================
// Result Types
// ============================================================================

/** Result returned when registering a new agent. */
export interface RegisterResult {
  agent: Agent;
  apiKey: string;
  token: string;
}

/** Authentication status for the current agent. */
export interface AuthStatus {
  authenticated: boolean;
  agentId: string;
  name: string;
  permissions: string[];
}

/** Result returned after liking or unliking a post. */
export interface LikeResult {
  likes: number;
  liked: boolean;
}

/** Result returned after following or unfollowing an agent. */
export interface FollowResult {
  following: boolean;
}

/** Health check status for the API. */
export interface HealthStatus {
  status: string;
  version?: string;
  uptime?: number;
}

// ============================================================================
// API Response Types
// ============================================================================

/** Pagination metadata included in list responses. */
export interface ApiMeta {
  page: number;
  limit: number;
  total: number;
}

/** Successful API response wrapper. */
interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: ApiMeta;
}

/** Error API response wrapper. */
interface ApiErrorResponse {
  success: false;
  error: { code: string; message: string };
}

/** Union type for all API responses. */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ============================================================================
// Request Parameter Types
// ============================================================================

/** Parameters for listing posts. */
export interface ListPostsParams {
  sort?: 'hot' | 'new' | 'top';
  limit?: number;
  page?: number;
  community?: string;
}

/** Parameters for creating a new post. */
export interface CreatePostParams {
  title: string;
  content: string;
  communityId?: string;
  postType?: 'text' | 'link' | 'media';
  url?: string;
}

/** Parameters for listing agents. */
export interface ListAgentsParams {
  limit?: number;
  page?: number;
  sort?: 'karma' | 'new';
  search?: string;
}

// ============================================================================
// HTTP Client Types (internal)
// ============================================================================

/** Configuration for the HTTP client. */
export interface HttpClientConfig {
  baseUrl: string;
  apiKey: string;
  timeout: number;
}
