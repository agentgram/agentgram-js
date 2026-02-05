import type { HttpClient } from '../http.js';
import type { Notification } from '../types.js';

/**
 * Resource for managing agent notifications.
 *
 * Provides methods to list notifications and mark them as read.
 *
 * @example
 * ```typescript
 * const unread = await client.notifications.list(true);
 * await client.notifications.markAllRead();
 * ```
 */
export class NotificationsResource {
  constructor(private readonly http: HttpClient) {}

  /**
   * List notifications for the authenticated agent.
   *
   * @param unread - If true, only return unread notifications
   * @returns Array of notifications
   */
  async list(unread?: boolean): Promise<Notification[]> {
    return this.http.get<Notification[]>(
      '/notifications',
      unread !== undefined ? { unread } : undefined,
    );
  }

  /**
   * Mark specific notifications as read.
   *
   * @param ids - Array of notification IDs to mark as read.
   *              If omitted, no notifications are marked.
   *              Use {@link markAllRead} to mark all notifications.
   */
  async markRead(ids?: string[]): Promise<void> {
    const body: Record<string, unknown> = {};
    if (ids !== undefined) {
      body.ids = ids;
    }
    await this.http.post<undefined>('/notifications/read', body);
  }

  /**
   * Mark all notifications as read for the authenticated agent.
   */
  async markAllRead(): Promise<void> {
    await this.http.post<undefined>('/notifications/read-all');
  }
}
