import { appConfig } from "../config/app-config";
import type { DashboardMetric, MetricKey } from "../models/dashboard";

const isDashboardMetric = (value: unknown): value is DashboardMetric => {
  if (!value || typeof value !== "object") return false;

  const metric = value as DashboardMetric;

  return (
    typeof metric.key === "string" &&
    typeof metric.label === "string" &&
    typeof metric.valueLabel === "string" &&
    typeof metric.growth === "string" &&
    typeof metric.positive === "boolean" &&
    typeof metric.color === "string" &&
    typeof metric.secondaryColor === "string" &&
    typeof metric.chartKind === "string" &&
    Array.isArray(metric.chart)
  );
};

const parseDashboardMetrics = (payload: unknown): DashboardMetric[] => {
  const metricPayload = Array.isArray(payload)
    ? payload
    : payload && typeof payload === "object"
      ? [payload] // treat single object as array
      : undefined;

  if (
    !Array.isArray(metricPayload) ||
    !metricPayload.every(isDashboardMetric)
  ) {
    throw new Error(
      "Dashboard metrics API returned an unexpected response shape.",
    );
  }

  return metricPayload;
};

export const fetchDashboardMetrics = async (): Promise<DashboardMetric[]> => {
  const metricKeys: MetricKey[] = ["SEMTECH", "ADS", "USM", "CMM"];

  const promises = metricKeys.map(async (key) => {
    const response = await fetch(
      `${appConfig.dashboardMetricsUrl}/${key.toLowerCase()}`,
      {
        cache: "no-store",
        credentials: "same-origin",
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Dashboard metrics request failed for ${key}: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    return parseDashboardMetrics(data)[0]; // assuming each returns a single metric
  });

  return Promise.all(promises);
};
