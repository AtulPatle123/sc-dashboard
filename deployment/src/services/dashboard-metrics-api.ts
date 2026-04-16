import { appConfig } from "../config/app-config";
import type { PlatformHealth, MetricKey } from "../models/dashboard";
import { healthData } from "../data/healthData";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isPlatformHealth = (value: unknown): value is PlatformHealth => {
  if (!value || typeof value !== "object") return false;

  const health = value as PlatformHealth;

  return (
    typeof health.platform === "string" &&
    typeof health.overallStatus === "string" &&
    typeof health.timestamp === "string" &&
    Array.isArray(health.modules) &&
    Array.isArray(health.modulesResponse) &&
    typeof health.pushNotificationEligible === "boolean" &&
    typeof health.telemetryPath === "string" &&
    typeof health.logsDirectory === "string"
  );
};

const parsePlatformHealth = (payload: unknown): PlatformHealth[] => {
  const healthPayload = Array.isArray(payload)
    ? payload
    : payload && typeof payload === "object"
      ? [payload] // treat single object as array
      : undefined;

  if (!Array.isArray(healthPayload) || !healthPayload.every(isPlatformHealth)) {
    throw new Error(
      "Platform health API returned an unexpected response shape.",
    );
  }

  return healthPayload;
};

export const fetchSinglePlatform = async (key: MetricKey): Promise<PlatformHealth> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(`${appConfig.dashboardMetricsUrl}${key}`, {
      signal: controller.signal,
      cache: "no-store",
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(
        `Dashboard metrics request failed for ${key}: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    return parsePlatformHealth(data)[0];
  } catch {
    await delay(500);
    return healthData[key];
  }
};

export const fetchDashboardMetrics = async (): Promise<PlatformHealth[]> => {
  const metricKeys: MetricKey[] = ["SEMTECH", "ADS", "USM", "CMM"];
  return Promise.all(metricKeys.map(fetchSinglePlatform));
};
