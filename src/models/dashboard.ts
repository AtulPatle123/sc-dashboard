export type MetricKey = 'SEMTECH' | 'ADS' | 'USM' | 'CMM';
export type DetailNavKey = 'healthCheckup' | 'monitoring' | 'SEMTECH' | 'xyz';
export type AppScreen = 'home' | 'details';
export type NotificationSeverity = 'ok' | 'warn' | 'down';
export type ChartKind = 'area' | 'bar' | 'line';

export type Point = {
  month: string;
  value: number;
};

export type ChartPoint = Point & {
  bestFit: number;
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
