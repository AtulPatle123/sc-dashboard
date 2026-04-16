export type MetricKey = "SEMTECH" | "ADS" | "USM" | "CMM";
export type DetailNavKey = string;
export type AppScreen = "home" | "details";
export type NotificationSeverity = "ok" | "warn" | "down";
export type ChartKind = "area" | "bar" | "line";

export type Point = {
  month: string;
  value: number;
};

export type ChartPoint = Point & {
  bestFit: number;
};

export type Dependency = {
  name: string;
  status: string;
};

export type ModuleResponse = {
  name: string;
  status: string;
  version: string;
  noOfInstances: number;
  dependencies: Dependency[];
};

export type PlatformHealth = {
  platform: string;
  overallStatus: string;
  timestamp: string;
  modules: string[];
  modulesResponse: ModuleResponse[];
  pushNotificationEligible: boolean;
  telemetryPath: string;
  logsDirectory: string;
  jobsPath?: string;
};

export type DashboardMetric = {
  key: MetricKey;
  label: string;
  valueLabel: string;
  growth: string;
  positive: boolean;
  color: string;
  secondaryColor: string;
  chartKind: ChartKind;
  chart: Point[];
  overallStatus: string;
};

export type DetailCard = {
  id: string;
  title: string;
  subtitle: string;
  metricKey: MetricKey;
};

export type AlertNotification = {
  id: string;
  title: string;
  message: string;
  severity: NotificationSeverity;
  timestamp: string;
};
