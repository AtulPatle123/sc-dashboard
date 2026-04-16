import React from "react";
import type { PlatformHealth } from "../models/dashboard";
import Skeleton from "react-loading-skeleton";

interface MetricsGridProps {
  data: PlatformHealth[];
  activeMetric: string;
  isLoading: boolean;
  onMetricClick: (platform: string) => void;
  onNavigateToDetails: (platform: string) => void;
}

const TOTAL_CARDS = 4;

const getMetricDisplay = (metric: PlatformHealth) => {
  const instances = metric.modulesResponse.reduce(
    (s, m) => s + m.noOfInstances,
    0,
  );
  const upCount = metric.modulesResponse.filter(
    (m) => m.status === "UP",
  ).length;
  const total = metric.modulesResponse.length || 1;

  const value = instances * 200 + metric.modules.length * 100;
  const displayValue = value > 0 ? value.toLocaleString() : "—";

  const ratio = upCount / total;
  const pct = ((ratio - 0.5) * 20).toFixed(1);
  const positive = parseFloat(pct) >= 0;
  const growthText = `${positive ? "+" : ""}${pct}% since last month`;

  return { displayValue, growthText, positive };
};

export const MetricsGrid: React.FC<MetricsGridProps> = ({
  data,
  activeMetric,
  isLoading,
  onMetricClick,
  onNavigateToDetails,
}) => {
  // Show skeleton placeholders for cards not yet loaded
  const skeletonCount = Math.max(0, TOTAL_CARDS - data.length);

  return (
    <section className="metrics-grid">
      {data.map((metric) => {
        const statusLower = metric.overallStatus.toLowerCase();
        const isActive = metric.platform === activeMetric;
        const { displayValue, growthText, positive } = getMetricDisplay(metric);

        return (
          <button
            key={metric.platform}
            className={`metric-card metric-status-${statusLower}${isActive ? " active" : ""}`}
            onClick={() => {
              onMetricClick(metric.platform);
              onNavigateToDetails(metric.platform);
            }}
          >
            <div className="metric-card-header">
              <p className="metric-title">{metric.platform}</p>
              <span className={`metric-status-badge badge-${statusLower}`}>
                {metric.overallStatus === "UP"
                  ? "↑ UP"
                  : metric.overallStatus === "DOWN"
                    ? "↓ DOWN"
                    : "⚠ WARN"}
              </span>
            </div>
          </button>
        );
      })}

      {/* Skeleton cards for pending API calls */}
      {(isLoading || skeletonCount > 0) &&
        Array.from({
          length: skeletonCount || (data.length === 0 ? TOTAL_CARDS : 0),
        }).map((_, i) => (
          <div key={`sk-${i}`} className="metric-card metric-card-skeleton">
            <Skeleton
              width={100}
              height={32}
              borderRadius={6}
              style={{ margin: "10px 0 6px" }}
            />
            <Skeleton width={120} height={12} borderRadius={6} />
          </div>
        ))}
    </section>
  );
};
