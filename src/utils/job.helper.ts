import {
  FiCheckCircle,
  FiXCircle,
  FiPlay,
  FiStopCircle,
  FiAlertTriangle,
} from "react-icons/fi";
import { JobStatus } from "../constants/jobs.constants";
import type { StatusMeta } from "../types/jobs-tab.types";

export function formatDateTime(iso: string): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function calcDuration(start: string, end: string): string {
  if (!start || !end) return "—";
  try {
    const ms = new Date(end).getTime() - new Date(start).getTime();
    if (ms < 0) return "—";
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    if (h > 0) return `${h}h ${m % 60}m ${s % 60}s`;
    if (m > 0) return `${m}m ${s % 60}s`;
    return `${s}s`;
  } catch {
    return "—";
  }
}

export function getStatusMeta(status: string): StatusMeta {
  const s = status?.toUpperCase();
  if (s === JobStatus.COMPLETED || s === JobStatus.UP)
    return { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", Icon: FiCheckCircle };
  if (s === JobStatus.FAILED || s === JobStatus.DOWN)
    return { color: "#dc2626", bg: "#fff5f5", border: "#fecaca", Icon: FiXCircle };
  if (s === JobStatus.RUNNING || s === JobStatus.STARTED)
    return { color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe", Icon: FiPlay };
  if (s === JobStatus.STOPPED || s === JobStatus.STOPPING)
    return { color: "#64748b", bg: "#f8fafc", border: "#e2e8f0", Icon: FiStopCircle };
  return { color: "#d97706", bg: "#fffbeb", border: "#fde68a", Icon: FiAlertTriangle };
}
