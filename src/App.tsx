import React, { useState } from "react";
import type { CSSProperties } from "react";

import "./App.scss";
import Header from "./components/header/header";
import "./styles.css";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { appConfig } from "./config/app-config";
import type {
  AppScreen,
  MetricKey,
  PlatformHealth,
  AlertNotification,
} from "./models/dashboard";
import { fetchDashboardMetrics } from "./services/dashboard-metrics-api";

// Components
import { HomeLayout } from "./components/HomeLayout";
import { DetailsLayout } from "./components/DetailsLayout";
import { DetailsKPIStrip } from "./components/DetailsKPIStrip";
import { NotificationsPanel } from "./components/NotificationsPanel";
import { ErrorState, NoDataState } from "./components/StateComponents";

// Utils
import { getStatusColor, getStatusSecondaryColor } from "./utils/statusHelper";
import { getNextMetric } from "./utils/metricHelper";

// Mock data
import { notifications } from "./data/notificationsData";

export const App = () => {
  const {
    data = [],
    error,
    isError,
    isLoading,
  } = useQuery<PlatformHealth[], Error>({
    queryKey: ["dashboard-metrics"],
    queryFn: fetchDashboardMetrics,
  });

  const [activeMetric, setActiveMetric] = useState<MetricKey>("SEMTECH");
  const [showNotifications, setShowNotifications] = useState(false);
  const [screen, setScreen] = useState<AppScreen>("home");
  const [selectedModule, setSelectedModule] = useState<string>("");
  const [alertDismissed, setAlertDismissed] = useState(false);

  const selected =
    data.find((item) => item.platform === activeMetric) ?? data[0];

  const unreadAlerts = notifications.filter(
    (item: AlertNotification) => item.severity !== "ok",
  ).length;
  const hasNoData = !isLoading && !isError && data.length === 0;

  // Find first DOWN service across all platforms for alert banner
  const downAlert = !alertDismissed
    ? data
        .flatMap((p) =>
          p.modulesResponse
            .filter((m) => m.status === "DOWN")
            .map((m) => ({ service: m.name, platform: p.platform, timestamp: p.timestamp }))
        )
        .concat(
          data.flatMap((p) =>
            p.modules
              .filter((mod) =>
                p.modulesResponse.some(
                  (mr) =>
                    mr.name.endsWith(mod) || mr.name === `sc-${mod}`,
                ) === false && p.overallStatus === "DOWN"
              )
              .map(() => ({ service: "service", platform: p.platform, timestamp: p.timestamp }))
          )
        )[0]
    : null;

  // Use notification with "down" severity as fallback alert
  const notifAlert = !alertDismissed
    ? notifications.find((n: AlertNotification) => n.severity === "down")
    : null;

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

  const formatAlertTime = (ts: string) => {
    try {
      return new Date(ts).toLocaleString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return ts;
    }
  };

  return (
    <div>
      <Header />

      <main className="app-shell" style={chartStyles}>
        <header className="top-bar">
          <div>
            <p className="overview-label">Calm Operations Dashboard</p>
            <h1>Service Health Center</h1>
          </div>

          <div className="notif-wrapper">
            <button
              className="notification-button"
              onClick={() => setShowNotifications((current) => !current)}
            >
              <span className="notification-icon" aria-hidden>
                🔔
              </span>
              <span>Notifications</span>
              {unreadAlerts > 0 && (
                <span className="notification-badge">{unreadAlerts}</span>
              )}
            </button>

            <NotificationsPanel
              isVisible={showNotifications}
              notifications={notifications}
            />
          </div>
        </header>

        {/* Alert Banner */}
        {(downAlert || notifAlert) && (
          <div className="alert-banner">
            <span className="alert-badge">down</span>
            <div className="alert-content">
              <span className="alert-title">
                {downAlert
                  ? `${downAlert.service} DOWN`
                  : notifAlert?.title}
              </span>
              {downAlert && (
                <span className="alert-timestamp">
                  {" "}· {formatAlertTime(downAlert.timestamp)}
                </span>
              )}
              <p className="alert-message">
                {downAlert
                  ? `Module ${downAlert.service} is DOWN on platform ${downAlert.platform}.`
                  : notifAlert?.message}
              </p>
            </div>
            <button
              className="alert-dismiss"
              onClick={() => setAlertDismissed(true)}
              aria-label="Dismiss alert"
            >
              ✕
            </button>
          </div>
        )}

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
                onBackClick={() => setScreen("home")}
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
