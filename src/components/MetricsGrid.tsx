import React from "react";
import type { PlatformHealth } from "../models/dashboard";
import { getStatusColor, getStatusSecondaryColor } from "../utils/statusHelper";
import type { CSSProperties } from "react";

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
      {data.map((metric) => (
        <button
          key={metric.platform}
          className={`metric-card ${metric.platform === activeMetric ? "active" : ""}`}
          onClick={() => {
            onMetricClick(metric.platform);
            onNavigateToDetails(metric.platform);
          }}
          style={
            {
              "--accent": getStatusColor(metric.overallStatus),
              "--accent-2": getStatusSecondaryColor(metric.overallStatus),
            } as CSSProperties
          }
        >
          <p className="metric-title">{metric.platform}</p>
          <p className="metric-value">{metric.overallStatus}</p>
          <p className="metric-growth">
            {metric.modulesResponse.length} services
          </p>
        </button>
      ))}
    </section>
  );
};
