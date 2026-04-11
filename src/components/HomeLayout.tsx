import React from "react";
import { MetricsGrid } from "./MetricsGrid";
import { HealthMetricsGraph } from "./HealthMetricsGraph";
import { PlatformSummary } from "./PlatformSummary";
import type { PlatformHealth, MetricKey } from "../models/dashboard";

interface HomeLayoutProps {
  data: PlatformHealth[];
  selected: PlatformHealth | undefined;
  activeMetric: string;
  isLoading: boolean;
  isGraphHovered: boolean;
  onMetricClick: (platform: string) => void;
  onGraphMouseEnter: () => void;
  onGraphMouseLeave: () => void;
  onNavigateToDetails: (platform: string) => void;
}

export const HomeLayout: React.FC<HomeLayoutProps> = ({
  data,
  selected,
  activeMetric,
  isLoading,
  isGraphHovered,
  onMetricClick,
  onGraphMouseEnter,
  onGraphMouseLeave,
  onNavigateToDetails,
}) => {
  return (
    <>
      <MetricsGrid
        data={data}
        activeMetric={activeMetric}
        onMetricClick={(platform) => onMetricClick(platform as MetricKey)}
        onNavigateToDetails={(platform) => onNavigateToDetails(platform as MetricKey)}
      />

      <section className="home-layout">
        <section className="overview-card">
          <div className="overview-header">
            <div>
              <p className="overview-label">Service Status</p>
              <h2>{selected?.platform} Health Overview</h2>
              <p className="overview-subtitle">
                Real-time status of all services and dependencies.
              </p>
            </div>
          </div>

          <HealthMetricsGraph
            selected={selected}
            isLoading={isLoading}
            onMouseEnter={onGraphMouseEnter}
            onMouseLeave={onGraphMouseLeave}
          />
        </section>

        <PlatformSummary selected={selected} />
      </section>
    </>
  );
};
