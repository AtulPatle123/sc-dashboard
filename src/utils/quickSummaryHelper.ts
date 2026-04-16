import type { PlatformHealth } from "../models/dashboard";

export interface SummaryItem {
  icon: string;
  text: string;
  color: string;
  bgColor: string;
  priority: number; // 0 = critical, 1 = warning, 2 = info
}

export const generateQuickSummary = (
  selected: PlatformHealth | undefined,
): SummaryItem[] => {
  if (!selected) {
    return [
      {
        icon: "⏳",
        text: "Loading platform data…",
        color: "#6b7280",
        bgColor: "rgba(107, 114, 128, 0.1)",
        priority: 2,
      },
    ];
  }

  const summaryItems: SummaryItem[] = [];
  const responses = selected.modulesResponse;

  // Count module statuses
  const downModules = responses.filter((m) => m.status === "DOWN");
  const warnModules = responses.filter((m) => m.status === "WARN");
  const upModules = responses.filter((m) => m.status === "UP");

  // Count dependency statuses
  let downDeps = 0;
  let warnDeps = 0;
  responses.forEach((mod) => {
    mod.dependencies.forEach((dep) => {
      if (dep.status === "DOWN") downDeps++;
      else if (dep.status === "WARN") warnDeps++;
    });
  });

  // Count total instances
  const totalInstances = responses.reduce(
    (sum, mod) => sum + mod.noOfInstances,
    0,
  );

  // Critical: Services DOWN
  if (downModules.length > 0) {
    summaryItems.push({
      icon: "🚨",
      text: `${downModules.length} service${downModules.length > 1 ? "s" : ""} DOWN — Urgent action required`,
      color: "#991b1b",
      bgColor: "rgba(239, 68, 68, 0.1)",
      priority: 0,
    });
  }

  // Critical: Dependencies DOWN
  if (downDeps > 0) {
    summaryItems.push({
      icon: "⚡",
      text: `${downDeps} critical dependen${downDeps > 1 ? "cies" : "cy"} DOWN — Service impact likely`,
      color: "#dc2626",
      bgColor: "rgba(220, 38, 38, 0.1)",
      priority: 0,
    });
  }

  // Warning: Services in WARN state
  if (warnModules.length > 0 && downModules.length === 0) {
    summaryItems.push({
      icon: "⚠️",
      text: `${warnModules.length} service${warnModules.length > 1 ? "s" : ""} at warning level — Monitor closely`,
      color: "#92400e",
      bgColor: "rgba(245, 158, 11, 0.1)",
      priority: 1,
    });
  }

  // Warning: Dependencies in WARN state
  if (warnDeps > 0 && downDeps === 0) {
    summaryItems.push({
      icon: "⚠️",
      text: `${warnDeps} dependen${warnDeps > 1 ? "cies" : "cy"} degraded — Check system load`,
      color: "#b45309",
      bgColor: "rgba(245, 158, 11, 0.1)",
      priority: 1,
    });
  }

  // Positive: All healthy
  if (
    downModules.length === 0 &&
    downDeps === 0 &&
    warnModules.length === 0 &&
    warnDeps === 0
  ) {
    summaryItems.push({
      icon: "✨",
      text: `All ${upModules.length} service${upModules.length > 1 ? "s" : ""} running smoothly — No issues detected`,
      color: "#065f46",
      bgColor: "rgba(16, 185, 129, 0.1)",
      priority: 2,
    });
  }

  // Resource info: Total instances
  if (totalInstances > 0) {
    summaryItems.push({
      icon: "📦",
      text: `${totalInstances} instance${totalInstances > 1 ? "s" : ""} active across all services`,
      color: "#4b5563",
      bgColor: "rgba(75, 85, 99, 0.1)",
      priority: 2,
    });
  }

  // Platform notification status
  if (selected.pushNotificationEligible) {
    summaryItems.push({
      icon: "🔔",
      text: "Push notifications enabled for alerts",
      color: "#059669",
      bgColor: "rgba(16, 185, 129, 0.1)",
      priority: 2,
    });
  }

  // Version info if available
  if (responses.length > 0 && responses[0].version) {
    const latestVersion = responses[0].version;
    summaryItems.push({
      icon: "📌",
      text: `Running version ${latestVersion}`,
      color: "#6366f1",
      bgColor: "rgba(99, 102, 241, 0.1)",
      priority: 2,
    });
  }

  // Sort by priority: critical (0) → warning (1) → info (2)
  return summaryItems.sort((a, b) => a.priority - b.priority);
};

export const getSummaryItemClasses = (item: SummaryItem): string => {
  switch (item.priority) {
    case 0:
      return "summary-critical";
    case 1:
      return "summary-warning";
    default:
      return "summary-info";
  }
};
