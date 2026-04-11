import { appConfig } from "../config/app-config";
import type { PlatformHealth, MetricKey } from "../models/dashboard";

const mockData: Record<MetricKey, PlatformHealth> = {
  SEMTECH: {
    platform: "SEMTECH",
    overallStatus: "UP",
    timestamp: "2026-04-10T13:15:00.000000Z",
    modules: [
      "semtech-core-service",
      "semtech-analytics-service",
      "semtech-data-processor",
      "semtech-api-gateway",
      "semtech-monitoring-service",
      "semtech-config-service",
      "semtech-notification-service",
    ],
    modulesResponse: [
      {
        name: "sc-semtech-core-service",
        status: "UP",
        version: "1.5.0",
        noOfInstances: 2,
        dependencies: [
          { name: "PostgreSQL", status: "UP" },
          { name: "Redis", status: "UP" },
          { name: "Kafka", status: "UP" },
        ],
      },
      {
        name: "sc-semtech-analytics-service",
        status: "DOWN",
        version: "1.4.1",
        noOfInstances: 1,
        dependencies: [
          { name: "Elasticsearch", status: "DOWN" },
          { name: "PostgreSQL", status: "UP" },
        ],
      },
    ],
    pushNotificationEligible: true,
    telemetryPath:
      "http://10.251.136.92:9943/search?service=sc-semtech-core-service",
    logsDirectory: "https://10.251.12.252/logsdir/semtech/",
  },
  ADS: {
    platform: "ADS",
    overallStatus: "UP",
    timestamp: "2026-04-10T13:14:40.432494Z",
    modules: [
      "ads-analytics-service",
      "ads-analytics-ingestion-service",
      "ads-config-command-service",
      "ads-config-reader-service",
      "ads-data-export-jobs",
      "ads-document-service",
      "ads-api-service",
    ],
    modulesResponse: [
      {
        name: "sc-ads-adapter-service",
        status: "UP",
        version: "2.1.2",
        noOfInstances: 1,
        dependencies: [
          { name: "RabbitMQ", status: "UP" },
          { name: "MongoDB", status: "UP" },
          { name: "Valkey", status: "UP" },
          { name: "S3", status: "UP" },
        ],
      },
    ],
    pushNotificationEligible: false,
    telemetryPath:
      "http://10.251.136.92:9943/search?end=1775800219111000&limit=20&lookback=1h&maxDuration&minDuration&service=sc-ads-adapter-service-go",
    logsDirectory: "https://10.251.12.252/logsdir/",
  },
  USM: {
    platform: "USM",
    overallStatus: "WARN",
    timestamp: "2026-04-10T13:16:00.000000Z",
    modules: [
      "usm-user-service",
      "usm-session-manager",
      "usm-metrics-collector",
      "usm-api-service",
      "usm-data-sync",
      "usm-config-service",
      "usm-alert-service",
    ],
    modulesResponse: [
      {
        name: "sc-usm-user-service",
        status: "WARN",
        version: "2.0.1",
        noOfInstances: 1,
        dependencies: [
          { name: "MySQL", status: "UP" },
          { name: "Elasticsearch", status: "WARN" },
        ],
      },
      {
        name: "sc-usm-session-manager",
        status: "UP",
        version: "2.1.0",
        noOfInstances: 3,
        dependencies: [
          { name: "Redis", status: "UP" },
          { name: "MySQL", status: "UP" },
          { name: "RabbitMQ", status: "UP" },
        ],
      },
    ],
    pushNotificationEligible: true,
    telemetryPath:
      "http://10.251.136.92:9943/search?service=sc-usm-user-service",
    logsDirectory: "https://10.251.12.252/logsdir/usm/",
  },
  CMM: {
    platform: "CMM",
    overallStatus: "UP",
    timestamp: "2026-04-10T13:17:00.000000Z",
    modules: [
      "cmm-core-service",
      "cmm-metrics-aggregator",
      "cmm-data-export-jobs",
      "cmm-api-service",
      "cmm-config-manager",
      "cmm-health-monitor",
      "cmm-notification-handler",
    ],
    modulesResponse: [
      {
        name: "sc-cmm-core-service",
        status: "UP",
        version: "1.8.3",
        noOfInstances: 3,
        dependencies: [
          { name: "Cassandra", status: "UP" },
          { name: "RabbitMQ", status: "UP" },
          { name: "S3", status: "UP" },
        ],
      },
      {
        name: "sc-cmm-metrics-aggregator",
        status: "UP",
        version: "1.7.2",
        noOfInstances: 2,
        dependencies: [
          { name: "Cassandra", status: "UP" },
          { name: "Kafka", status: "UP" },
          { name: "Redis", status: "UP" },
        ],
      },
    ],
    pushNotificationEligible: false,
    telemetryPath:
      "http://10.251.136.92:9943/search?service=sc-cmm-core-service",
    logsDirectory: "https://10.251.12.252/logsdir/cmm/",
  },
};

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

export const fetchDashboardMetrics = async (): Promise<PlatformHealth[]> => {
  const metricKeys: MetricKey[] = ["SEMTECH", "ADS", "USM", "CMM"];

  const promises = metricKeys.map(async (key) => {
    try {
      // Force failure for testing mock data fallback
      throw new Error(`Forced failure for testing - API for ${key} is down`);

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
      return parsePlatformHealth(data)[0]; // assuming each returns a single health object
    } catch (error) {
      // Fallback to mock data after delay to simulate real API
      await delay(1000); // 1 second delay
      return mockData[key];
    }
  });

  return Promise.all(promises);
};
