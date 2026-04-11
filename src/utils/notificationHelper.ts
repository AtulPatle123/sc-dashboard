import type { NotificationSeverity } from "../models/dashboard";

export const notificationIconBySeverity: Record<NotificationSeverity, string> =
  {
    down: "⛔",
    warn: "⚠️",
    ok: "✅",
  };
