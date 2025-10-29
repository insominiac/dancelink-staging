import db from './db'
import { NotificationTriggers } from './notification-triggers'

export type AdminNotifyPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'

interface BaseNotifyOptions {
  title: string
  message: string
  priority?: AdminNotifyPriority
  actionUrl?: string | null
  type?: string
}

export class AdminNotifier {
  // Send a simple notification to all admins (in-app + push if available)
  static async notifyAllAdmins(options: BaseNotifyOptions) {
    const {
      title,
      message,
      priority = 'NORMAL',
      actionUrl = null,
      type = 'SYSTEM_ANNOUNCEMENT',
    } = options

    // Fetch all admin user IDs
    const admins = await db.user.findMany({
      where: { role: 'ADMIN' },
      select: { id: true }
    })

    if (admins.length === 0) return

    const adminIds = admins.map(a => a.id)

    // Create in-app notifications (schema supports these fields)
    await db.notification.createMany({
      data: adminIds.map(userId => ({
        userId,
        type,
        title,
        message,
        priority,
        actionUrl: actionUrl || undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    })

    // Try to send push notifications via existing trigger helper
    try {
      await NotificationTriggers.sendSystemAnnouncement(title, message, adminIds, priority)
    } catch (err) {
      console.error('Admin push notify failed (continuing):', err)
    }
  }

  // Build a readable message from an audit log row and notify admins
  static async notifyAdminsForAudit(audit: {
    id: string
    userId: string
    action: string
    tableName: string
    recordId: string
    createdAt?: Date
    newValues?: string | null
    oldValues?: string | null
  }) {
    const actor = audit.userId === 'system' ? 'system' : `user ${audit.userId}`
    const title = `[${audit.tableName}] ${audit.action}`

    const summaryParts: string[] = [
      `Actor: ${actor}`,
      `Record: ${audit.recordId}`,
      `Action: ${audit.action}`,
    ]

    const message = summaryParts.join(' | ')

    const actionUrl = this.mapAdminUrl(audit.tableName, audit.recordId)

    await this.notifyAllAdmins({
      title,
      message,
      priority: this.priorityForAction(audit.action),
      actionUrl,
      type: 'ADMIN_AUDIT_EVENT',
    })
  }

  private static priorityForAction(action: string): AdminNotifyPriority {
    const a = action.toUpperCase()
    if (a.includes('SECURITY') || a.includes('DISPUTE') || a.includes('FAILED')) return 'URGENT'
    if (a.includes('DELETE') || a.includes('CANCEL')) return 'HIGH'
    if (a.includes('UPDATE')) return 'NORMAL'
    return 'NORMAL'
  }

  // Best-effort mapping from table to an admin page URL
  private static mapAdminUrl(table: string, id: string): string | null {
    const t = table.toLowerCase()
    if (t.includes('user')) return `/admin#users`
    if (t.includes('class')) return `/admin#classes`
    if (t.includes('event')) return `/admin#events`
    if (t.includes('booking')) return `/admin#bookings`
    if (t.includes('transaction') || t.includes('payment')) return `/admin#payments`
    if (t.includes('venue')) return `/admin#venues`
    if (t.includes('contact')) return `/admin#contact`
    if (t.includes('forum')) return `/admin#forum`
    if (t.includes('seo')) return `/admin#seo`
    return '/admin'
  }
}