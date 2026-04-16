import React, { useMemo, useState, useRef, useEffect } from "react";
import type { PlatformHealth, MetricKey } from "../models/dashboard";
import { generateQuickSummary } from "../utils/quickSummaryHelper";
import { MetricsGrid } from "./MetricsGrid";
import Skeleton from "react-loading-skeleton";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   ResponsiveContainer,
//   CartesianGrid,
//   Tooltip,
// } from "recharts";

interface HomeLayoutProps {
  data: PlatformHealth[];
  selected: PlatformHealth | undefined;
  activeMetric: string;
  isLoading: boolean;
  onMetricClick: (platform: string) => void;
  onNavigateToDetails: (platform: string) => void;
}

const DAYS = ["Apr 5", "Apr 6", "Apr 7", "Apr 8", "Apr 9", "Apr 10", "Apr 11"];

/** Build trend bars from the live platform data received from the API
 *  (the service layer already falls back to mock data on API failure). */
const getTrendDataFromHealth = (platformHealth: PlatformHealth | undefined) => {
  if (!platformHealth) {
    return DAYS.map((day) => ({ day, value: 0 }));
  }

  const responses = platformHealth.modulesResponse;
  const totalServices = responses.length;
  const upCount = responses.filter((r) => r.status === "UP").length;
  const warnCount = responses.filter((r) => r.status === "WARN").length;
  const downCount = responses.filter((r) => r.status === "DOWN").length;
  const instanceTotal = responses.reduce(
    (sum, module) => sum + module.noOfInstances,
    0,
  );

  const healthFactor =
    totalServices > 0
      ? (upCount * 1.0 + warnCount * 0.65 + downCount * 0.25) / totalServices
      : 0.5;
  const baseValue = Math.round(1200 * healthFactor + instanceTotal * 25);

  return DAYS.map((day, index) => {
    const delta = Math.round((index - 3) * 18 + (index % 2 === 0 ? 12 : -8));
    return { day, value: Math.max(200, baseValue + delta) };
  });
};

export const HomeLayout: React.FC<HomeLayoutProps> = ({
  data,
  selected,
  activeMetric,
  isLoading,
  onMetricClick,
  onNavigateToDetails,
}) => {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const carouselIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentPlatformData =
    data.length > 0 ? data[carouselIndex % data.length] : selected;

  // const trendData = useMemo(
  //   () => getTrendDataFromHealth(currentPlatformData),
  //   [currentPlatformData],
  // );
  const summaryItems = useMemo(
    () => generateQuickSummary(currentPlatformData),
    [currentPlatformData],
  );

  useEffect(() => {
    if (isCarouselPaused || !data.length || isLoading) return;

    carouselIntervalRef.current = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % data.length);
    }, 5000);

    return () => {
      if (carouselIntervalRef.current)
        clearInterval(carouselIntervalRef.current);
    };
  }, [isCarouselPaused, data.length, isLoading]);

  const handleCarouselPrev = () => {
    setCarouselIndex((prev) => (prev - 1 + data.length) % data.length);
    setIsCarouselPaused(true);
  };

  const handleCarouselNext = () => {
    setCarouselIndex((prev) => (prev + 1) % data.length);
    setIsCarouselPaused(true);
  };

  // Show skeleton chart when no data yet
  const showChartSkeleton = data.length === 0;
  const showSummarySkeleton = data.length === 0;

  return (
    <>
      {/* ── Metric Cards Row ── */}
      <MetricsGrid
        data={data}
        activeMetric={activeMetric}
        isLoading={isLoading}
        onMetricClick={(p) => onMetricClick(p as MetricKey)}
        onNavigateToDetails={(p) => onNavigateToDetails(p as MetricKey)}
      />

      {/* ── Trend + Summary ── */}
      <section className="home-layout">
        <div className="overview-card trend-card">
          <div className="overview-header">
            <div>
              {/* <p className="overview-label">Overview</p> */}
              {showChartSkeleton ? (
                <Skeleton
                  width={180}
                  height={24}
                  borderRadius={6}
                  style={{ marginTop: 6 }}
                />
              ) : (
                <>
                  {/* <h2>{currentPlatformData?.platform ?? "—"} trend</h2>
                  <p className="overview-subtitle">
                    Chart bars adjust to metric context for cleaner data
                    representation.
                  </p> */}
                </>
              )}
            </div>
          </div>

          {showChartSkeleton ? (
            <div className="chart-wrap">
              <Skeleton
                height={220}
                borderRadius={10}
                style={{ marginTop: 14 }}
              />
            </div>
          ) : (
            <>
              {/* <div
                className="chart-wrap"
                onMouseEnter={() => setIsCarouselPaused(true)}
                onMouseLeave={() => setIsCarouselPaused(false)}
              >
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
                    <Bar dataKey="value" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div> */}

              <div className="chart-placeholder-img">
                <div className="chart-placeholder-img" style={{ width: "100%" }}>
                  <img
                    src={require("../assets/homehealth.png")}
                    alt="Graph image placeholder"
                    title="Graph placeholder"
                    style={{ width: "100%", height: "auto", display: "block" }}
                    onError={(e) => {
                      console.log("Failed to load graph image, showing placeholder.");
                    }}
                  />
                </div>
              </div>

              {/* <div className="carousel-controls">
                <button className="carousel-btn" onClick={handleCarouselPrev}>
                  ←
                </button>
                <span className="carousel-counter">
                  {data.length > 0
                    ? `${carouselIndex + 1} / ${data.length}`
                    : "— / —"}
                </span>
                <button className="carousel-btn" onClick={handleCarouselNext}>
                  →
                </button>
              </div> */}
            </>
          )}
        </div>

        <aside className="side-insights">
          <h3>{currentPlatformData?.platform} Quick Summary</h3>
          {showSummarySkeleton ? (
            <ul className="summary-list">
              {Array.from({ length: 5 }).map((_, i) => (
                <li key={i} className="summary-item">
                  <Skeleton circle width={20} height={20} />
                  <Skeleton
                    width="80%"
                    height={13}
                    borderRadius={6}
                    style={{ flex: 1 }}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <ul className="summary-list">
              {summaryItems.map((item, i) => (
                <li
                  key={i}
                  className={`summary-item summary-priority-${item.priority}`}
                >
                  <span className="summary-icon">{item.icon}</span>
                  <span className="summary-text">{item.text}</span>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </section>
    </>
  );
};
