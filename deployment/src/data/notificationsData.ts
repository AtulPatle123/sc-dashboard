import type { AlertNotification } from "../models/dashboard";
import { healthData } from "./healthData";

function deriveNotificationsFromHealth(): AlertNotification[] {
  const result: AlertNotification[] = [];
  const now = new Date();

  Object.values(healthData).forEach((platform) => {
    const { platform: name, overallStatus, modulesResponse, timestamp } = platform;

    const minsAgo = Math.floor(
      (now.getTime() - new Date(timestamp).getTime()) / 60000,
    );
    const timeLabel =
      minsAgo < 60
        ? `${minsAgo} min ago`
        : `${Math.floor(minsAgo / 60)}h ${minsAgo % 60}m ago`;

    // Collect degraded dependencies across all modules
    const downDeps: string[] = [];
    const warnDeps: string[] = [];

    modulesResponse.forEach((mod) => {
      mod.dependencies.forEach((dep) => {
        if (dep.status === "DOWN") downDeps.push(dep.name);
        else if (dep.status === "WARN") warnDeps.push(dep.name);
      });
    });

    if (downDeps.length > 0) {
      result.push({
        id: `${name}-dep-down`,
        title: `${name} — Critical Dependency Down`,
        message: `${downDeps.join(", ")} ${downDeps.length > 1 ? "are" : "is"} DOWN. Service impact possible.`,
        severity: "down",
        timestamp: timeLabel,
      });
    }

    if (warnDeps.length > 0) {
      result.push({
        id: `${name}-dep-warn`,
        title: `${name} — Dependency Degraded`,
        message: `${warnDeps.join(", ")} ${warnDeps.length > 1 ? "are" : "is"} reporting warnings in ${name}.`,
        severity: "warn",
        timestamp: timeLabel,
      });
    }

    if (overallStatus === "DOWN") {
      result.push({
        id: `${name}-platform-down`,
        title: `${name} Platform Down`,
        message: `Platform ${name} is DOWN. Immediate attention required.`,
        severity: "down",
        timestamp: timeLabel,
      });
    } else if (overallStatus === "WARN" && downDeps.length === 0 && warnDeps.length === 0) {
      result.push({
        id: `${name}-platform-warn`,
        title: `${name} Platform Warning`,
        message: `Platform ${name} overall status is WARN. Monitor for further degradation.`,
        severity: "warn",
        timestamp: timeLabel,
      });
    } else if (overallStatus === "UP" && downDeps.length === 0 && warnDeps.length === 0) {
      result.push({
        id: `${name}-platform-ok`,
        title: `${name} — All Systems Healthy`,
        message: `All ${name} services and dependencies are operating normally.`,
        severity: "ok",
        timestamp: timeLabel,
      });
    }
  });

  // Sort: down → warn → ok
  const order: Record<string, number> = { down: 0, warn: 1, ok: 2 };
  return result.sort((a, b) => (order[a.severity] ?? 3) - (order[b.severity] ?? 3));
}

export const notifications = deriveNotificationsFromHealth();
