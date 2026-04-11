import type { MetricKey, PlatformHealth } from "../models/dashboard";

export const healthData: Record<MetricKey, PlatformHealth> = {
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
    ],
    pushNotificationEligible: true,
    telemetryPath:
      "http://10.251.136.92:9943/search?service=sc-semtech-core-service",
    logsDirectory: "https://10.251.12.252/logsdir/semtech/",
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
      "cmm-data-exporter",
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
    ],
    pushNotificationEligible: false,
    telemetryPath:
      "http://10.251.136.92:9943/search?service=sc-cmm-core-service",
    logsDirectory: "https://10.251.12.252/logsdir/cmm/",
  },
};
