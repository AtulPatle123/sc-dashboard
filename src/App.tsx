import React, { useState, useRef, useEffect as useReactEffect, useMemo } from "react";
import type { CSSProperties } from "react";

import "./App.scss";
import Header from "./components/header/header";
import "./styles.css";

import { useEffect } from "react";
import { useQueries } from "@tanstack/react-query";
import { appConfig } from "./config/app-config";
import type {
  AppScreen,
  MetricKey,
  PlatformHealth,
  AlertNotification,
} from "./models/dashboard";
import { fetchSinglePlatform } from "./services/dashboard-metrics-api";

// Components
import { HomeLayout } from "./components/HomeLayout";
import { DetailsLayout } from "./components/DetailsLayout";
import { DetailsKPIStrip } from "./components/DetailsKPIStrip";
import { NotificationsPanel } from "./components/NotificationsPanel";
import { ErrorState, NoDataState } from "./components/StateComponents";

// Utils
import { getStatusColor, getStatusSecondaryColor } from "./utils/statusHelper";
import { getNextMetric } from "./utils/metricHelper";

// (mock notifications are only used as a service-layer fallback inside dashboard-metrics-api.ts
//  — we never pre-load them here so the UI stays blank until the API round-trip completes)

const METRIC_KEYS: MetricKey[] = ["SEMTECH", "ADS", "USM", "CMM"];

/** Derive live notifications from API data. The service layer already falls
 *  back to mock healthData when the API is unreachable, so `platforms` always
 *  reflects real-or-fallback state — no extra handling needed here. */
function deriveNotificationsFromData(platforms: PlatformHealth[]): AlertNotification[] {
  const result: AlertNotification[] = [];
  const now = new Date();

  platforms.forEach((platform) => {
    const { platform: name, overallStatus, modulesResponse, timestamp } = platform;

    const minsAgo = Math.floor(
      (now.getTime() - new Date(timestamp).getTime()) / 60000,
    );
    const timeLabel =
      minsAgo < 60
        ? `${minsAgo} min ago`
        : `${Math.floor(minsAgo / 60)}h ${minsAgo % 60}m ago`;

    const downDeps: string[] = [];
    const warnDeps: string[] = [];

    modulesResponse.forEach((mod) => {
      mod.dependencies.forEach((dep) => {
        if (dep.status === "DOWN") downDeps.push(dep.name);
        else if (dep.status === "WARN") warnDeps.push(dep.name);
      });
    });

    if (downDeps.length > 0) {
      result.push({
        id: `${name}-dep-down`,
        title: `${name} — Critical Dependency Down`,
        message: `${downDeps.join(", ")} ${downDeps.length > 1 ? "are" : "is"} DOWN. Service impact possible.`,
        severity: "down",
        timestamp: timeLabel,
      });
    }

    if (warnDeps.length > 0) {
      result.push({
        id: `${name}-dep-warn`,
        title: `${name} — Dependency Degraded`,
        message: `${warnDeps.join(", ")} ${warnDeps.length > 1 ? "are" : "is"} reporting warnings in ${name}.`,
        severity: "warn",
        timestamp: timeLabel,
      });
    }

    if (overallStatus === "DOWN") {
      result.push({
        id: `${name}-platform-down`,
        title: `${name} Platform Down`,
        message: `Platform ${name} is DOWN. Immediate attention required.`,
        severity: "down",
        timestamp: timeLabel,
      });
    } else if (overallStatus === "WARN" && downDeps.length === 0 && warnDeps.length === 0) {
      result.push({
        id: `${name}-platform-warn`,
        title: `${name} Platform Warning`,
        message: `Platform ${name} overall status is WARN. Monitor for further degradation.`,
        severity: "warn",
        timestamp: timeLabel,
      });
    } else if (overallStatus === "UP" && downDeps.length === 0 && warnDeps.length === 0) {
      result.push({
        id: `${name}-platform-ok`,
        title: `${name} — All Systems Healthy`,
        message: `All ${name} services and dependencies are operating normally.`,
        severity: "ok",
        timestamp: timeLabel,
      });
    }
  });

  const order: Record<string, number> = { down: 0, warn: 1, ok: 2 };
  return result.sort((a, b) => (order[a.severity] ?? 3) - (order[b.severity] ?? 3));
}

export const App = () => {
  const results = useQueries({
    queries: METRIC_KEYS.map((key) => ({
      queryKey: ["dashboard-metric", key] as const,
      queryFn: () => fetchSinglePlatform(key),
    })),
  });

  const data: PlatformHealth[] = results
    .filter((r) => r.data !== undefined)
    .map((r) => r.data as PlatformHealth);

  const isLoading = results.some((r) => r.isPending);
  const isError = results.every((r) => r.isError);
  const error = results.find((r) => r.error)?.error as Error | undefined;

  const [activeMetric, setActiveMetric] = useState<MetricKey>("SEMTECH");
  const [showNotifications, setShowNotifications] = useState(false);
  const [screen, setScreen] = useState<AppScreen>("home");
  const [selectedModule, setSelectedModule] = useState<string>("");
  const notifWrapperRef = useRef<HTMLDivElement>(null);

  // Close notifications when clicking outside
  useReactEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notifWrapperRef.current &&
        !notifWrapperRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showNotifications]);

  const selected =
    data.find((item) => item.platform === activeMetric) ?? data[0];

  // Derive live notifications from API data only.
  // Returns [] while queries are in-flight so no mock data leaks into the UI.
  // The service layer (fetchSinglePlatform) already falls back to healthData mock
  // on network failure, so once data arrives it is always real-or-fallback.
  const liveNotifications = useMemo(
    () => (data.length > 0 ? deriveNotificationsFromData(data) : []),
    [data],
  );

  const unreadAlerts = liveNotifications.filter(
    (item: AlertNotification) => item.severity !== "ok",
  ).length;

  const hasNoData = !isLoading && !isError && data.length === 0;


  // Bell severity — worst status across all platforms
  const bellSeverity = useMemo(() => {
    if (!data.length) return "ok" as const;
    const hasDown = data.some(
      (p) =>
        p.overallStatus === "DOWN" ||
        p.modulesResponse.some((m) => m.status === "DOWN"),
    );
    if (hasDown) return "down" as const;
    const hasWarn = data.some(
      (p) =>
        p.overallStatus === "WARN" ||
        p.modulesResponse.some((m) => m.status === "WARN"),
    );
    return hasWarn ? ("warn" as const) : ("ok" as const);
  }, [data]);

  useEffect(() => {
    if (!data.length || screen === "details") return;

    const interval = window.setInterval(() => {
      setActiveMetric((current) => getNextMetric(data, current, "next"));
    }, 5000);

    return () => window.clearInterval(interval);
  }, [data, screen]);

  const chartStyles = {
    "--accent": selected ? getStatusColor(selected.overallStatus) : "#6B7280",
    "--accent-2": selected
      ? getStatusSecondaryColor(selected.overallStatus)
      : "#D1D5DB",
  } as CSSProperties;

  const environmentSelector = (
    <div className="header-env-wrap">
      <label className="header-env-label">Environment</label>
      <select className="header-env-select" defaultValue="DEV">
        <option value="DEV">DEV</option>
        <option value="SQE">SQE</option>
        <option value="PROD-DATA">PROD-DATA</option>
        <option value="PROD-PPR">PROD-PPR</option>
        <option value="PROD-EMEA">PROD-EMEA</option>
        <option value="PROD-CHINA">PROD-CHINA</option>
      </select>
    </div>
  );

  const notificationSlot = (
    <div className="notif-wrapper" ref={notifWrapperRef}>
      <button
        className={`header-notif-btn has-alerts bell-severity-${bellSeverity}`}
        onClick={() => setShowNotifications((current) => !current)}
        aria-label="Toggle notifications"
      >
        <span
          className={`notification-icon${bellSeverity === "down" ? " bell-ring" : ""}`}
          aria-hidden
        >
          <i className={`bi bi-bell${bellSeverity === "ok" ? "" : "-fill"} bell-icon-${bellSeverity}`} />
        </span>
        <span className="header-notif-label">Notifications</span>
        {unreadAlerts > 0 && (
          <span className="notification-badge">{unreadAlerts}</span>
        )}
      </button>
      <NotificationsPanel
        isVisible={showNotifications}
        notifications={liveNotifications}
        isLoading={isLoading}
        onClose={() => setShowNotifications(false)}
      />
    </div>
  );

  return (
    <div>
      <Header rightSlot={<>{environmentSelector}{notificationSlot}</>} />

      <main className="app-shell" style={chartStyles}>
        {/* Top bar — back button only */}
        {screen === "details" && (
          <div className="top-bar">
            <div className="top-bar-left">
              <button
                className="topbar-back-btn"
                onClick={() => setScreen("home")}
                aria-label="Back to Dashboard"
              >
                <i className="bi bi-arrow-left" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* Alert Banner Cards — side by side, derived from API data */}
        {isError ? (
          <ErrorState message={error?.message || "Unknown error occurred"} />
        ) : hasNoData ? (
          <NoDataState apiUrl={appConfig.dashboardMetricsUrl} />
        ) : (
          <>
            {screen === "home" && (
              <HomeLayout
                data={data}
                selected={selected}
                activeMetric={activeMetric}
                isLoading={isLoading}
                onMetricClick={(platform) =>
                  setActiveMetric(platform as MetricKey)
                }
                onNavigateToDetails={(platform) => {
                  const selectedPlatform = data.find(
                    (item) => item.platform === platform,
                  );
                  setSelectedModule(selectedPlatform?.modules[0] || "");
                  setActiveMetric(platform as MetricKey);
                  setScreen("details");
                }}
              />
            )}

            {screen === "details" && (
              <DetailsLayout
                selected={selected}
                selectedModule={selectedModule}
                onModuleSelect={setSelectedModule}
              >
                <DetailsKPIStrip
                  selected={selected}
                  selectedModule={selectedModule}
                />
              </DetailsLayout>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default App;
