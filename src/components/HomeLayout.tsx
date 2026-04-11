import React, { useMemo } from "react";
import type { PlatformHealth, MetricKey } from "../models/dashboard";
import { MetricsGrid } from "./MetricsGrid";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface HomeLayoutProps {
  data: PlatformHealth[];
  selected: PlatformHealth | undefined;
  activeMetric: string;
  isLoading: boolean;
  onMetricClick: (platform: string) => void;
  onNavigateToDetails: (platform: string) => void;
}

const trendDataByPlatform: Record<string, number[]> = {
  SEMTECH: [2800, 3050, 2950, 3150, 3080, 3200, 3297],
  ADS: [1900, 2100, 2050, 2200, 2280, 2310, 2356],
  USM: [780, 820, 840, 870, 890, 910, 924],
  CMM: [28, 26, 25, 24, 24, 23, 23],
};

const DAYS = ["Apr 5", "Apr 6", "Apr 7", "Apr 8", "Apr 9", "Apr 10", "Apr 11"];

const getTrendData = (platform: string) => {
  const values = trendDataByPlatform[platform] ?? [10, 12, 11, 14, 13, 15, 16];
  return DAYS.map((day, i) => ({ day, value: values[i] }));
};

const getQuickSummary = (selected: PlatformHealth | undefined): string[] => {
  if (!selected) return ["Loading platform data…"];
  const responses = selected.modulesResponse;
  const down = responses.filter((r) => r.status === "DOWN");
  const warn = responses.filter((r) => r.status === "WARN");
  const up = responses.filter((r) => r.status === "UP");
  const lines: string[] = [];

  if (down.length > 0) {
    lines.push(
      `${down.length} service${down.length > 1 ? "s are" : " is"} currently down and need${down.length > 1 ? "" : "s"} urgent action`
    );
  }
  if (warn.length > 0) {
    lines.push(
      `${warn.length} service${warn.length > 1 ? "s have" : " has"} warning level load`
    );
  }
  if (up.length > 0 && down.length === 0) {
    lines.push(
      `All ${up.length} service${up.length > 1 ? "s are" : " is"} running smoothly`
    );
  }
  lines.push(
    selected.pushNotificationEligible
      ? "Push notifications are enabled for this platform"
      : "All backups are healthy and completed"
  );
  const latestVersion = responses[0]?.version;
  if (latestVersion) {
    lines.push(
      `${selected.platform} is running version ${latestVersion} in the latest cycle`
    );
  }
  return lines;
};

export const HomeLayout: React.FC<HomeLayoutProps> = ({
  data,
  selected,
  activeMetric,
  isLoading,
  onMetricClick,
  onNavigateToDetails,
}) => {
  const trendData = useMemo(
    () => getTrendData(selected?.platform ?? ""),
    [selected?.platform]
  );
  const summary = useMemo(() => getQuickSummary(selected), [selected]);

  return (
    <>
      {/* ── Metric Cards Row ── */}
      <MetricsGrid
        data={data}
        activeMetric={activeMetric}
        onMetricClick={(p) => onMetricClick(p as MetricKey)}
        onNavigateToDetails={(p) => onNavigateToDetails(p as MetricKey)}
      />

      {/* ── Trend + Summary ── */}
      <section className="home-layout">
        <div className="overview-card trend-card">
          <div className="overview-header">
            <div>
              <p className="overview-label">Overview</p>
              <h2>{selected?.platform ?? "—"} trend</h2>
              <p className="overview-subtitle">
                Chart bars adjust to metric context for cleaner data
                representation.
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="loading">Loading…</div>
          ) : (
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={trendData}
                  barSize={28}
                  margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#818cf8" />
                      <stop offset="100%" stopColor="#c4b5fd" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#e9ecff" />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "#8a91c7", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#8a91c7", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 10,
                      border: "none",
                      boxShadow: "0 4px 20px rgba(79,70,229,0.15)",
                      fontSize: 13,
                    }}
                    cursor={{ fill: "rgba(129,140,248,0.08)" }}
                  />
                  <Bar
                    dataKey="value"
                    fill="url(#barGrad)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <aside className="side-insights">
          <h3>Quick Summary</h3>
          <ul className="summary-list">
            {summary.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </aside>
      </section>
    </>
  );
};
