import type { CSSProperties } from "react";

export enum DependencyStatus {
  UP = "UP",
  WARN = "WARN",
  DOWN = "DOWN",
}

/** Status → hex colour used for charts, icons, and badges */
export const STATUS_COLORS: Record<string, string> = {
  [DependencyStatus.UP]: "#10b981",
  [DependencyStatus.WARN]: "#f59e0b",
  [DependencyStatus.DOWN]: "#ef4444",
};

/** Fallback colour when status is unknown */
export const STATUS_COLOR_FALLBACK = "#64748b";

/** Fixed size for all dependency icons */
export const DEP_ICON_SIZE = 22;

/** Shared inline style applied to every dep icon */
export const DEP_ICON_STYLE: CSSProperties = { flexShrink: 0 };

/** Brand colours for specific technologies (not status-derived) */
export const BRAND_COLORS = {
  REDIS: "#e0312d",
  MONGO: "#47a248",
  MYSQL: "#4479a1",
  POSTGRES: "#336791",
  CASSANDRA: "#1287b1",
  RABBIT: "#ff6600",
  KAFKA: "#231f20",
  S3: "#e25444",
  ELASTIC: "#00bfb3",
} as const;
