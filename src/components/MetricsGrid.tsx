import React from "react";
import type { PlatformHealth } from "../models/dashboard";

interface MetricsGridProps {
  data: PlatformHealth[];
  activeMetric: string;
  onMetricClick: (platform: string) => void;
  onNavigateToDetails: (platform: string) => void;
}

const platformDisplayData: Record<
  string,
  { value: string; growth: string; positive: boolean }
> = {
  SEMTECH: { value: "3,297", growth: "+6.9% since last month", positive: true },
  ADS: { value: "2,356", growth: "+2.1% since last month", positive: true },
  USM: { value: "924", growth: "+11.0% since last month", positive: true },
  CMM: { value: "23", growth: "-1.8% since last month", positive: false },
};

export const MetricsGrid: React.FC<MetricsGridProps> = ({
  data,
  activeMetric,
  onMetricClick,
  onNavigateToDetails,
}) => {
  return (
    <section className="metrics-grid">
      {data.map((metric) => {
        const display = platformDisplayData[metric.platform] ?? {
          value: String(metric.modulesResponse.length),
          growth: "",
          positive: metric.overallStatus === "UP",
        };
        const statusLower = metric.overallStatus.toLowerCase();

        return (
          <button
            key={metric.platform}
            className={`metric-card ${metric.platform === activeMetric ? "active" : ""} metric-status-${statusLower}`}
            onClick={() => {
              onMetricClick(metric.platform);
              onNavigateToDetails(metric.platform);
            }}
          >
            <p className="metric-title">{metric.platform}</p>
            <p className="metric-number">{display.value}</p>
            <span className={`metric-status-badge badge-${statusLower}`}>
              {metric.overallStatus === "UP"
                ? "↑ UP"
                : metric.overallStatus === "DOWN"
                  ? "↓ DOWN"
                  : "⚠ WARN"}
            </span>
            {display.growth && (
              <p
                className={`metric-growth ${display.positive ? "positive" : "negative"}`}
              >
                {display.growth}
              </p>
            )}
          </button>
        );
      })}
    </section>
  );
};
