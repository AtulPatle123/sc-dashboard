import React from "react";
import type { PlatformHealth } from "../models/dashboard";

interface MetricsGridProps {
  data: PlatformHealth[];
  activeMetric: string;
  onMetricClick: (platform: string) => void;
  onNavigateToDetails: (platform: string) => void;
}


export const MetricsGrid: React.FC<MetricsGridProps> = ({
  data,
  activeMetric,
  onMetricClick,
  onNavigateToDetails,
}) => {
  return (
    <section className="metrics-grid">
      {data.map((metric) => {
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
            <span className={`metric-status-badge badge-${statusLower}`}>
              {metric.overallStatus === "UP"
                ? "↑ UP"
                : metric.overallStatus === "DOWN"
                  ? "↓ DOWN"
                  : "⚠ WARN"}
            </span>
          </button>
        );
      })}
    </section>
  );
};
