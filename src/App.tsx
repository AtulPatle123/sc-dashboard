import React from "react";
import type { CSSProperties } from "react";

import "./App.scss";
import Header from "./components/header/header";
import "./styles.css";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { appConfig } from "./config/app-config";
import type { AppScreen, MetricKey, PlatformHealth } from "./models/dashboard";
import { fetchDashboardMetrics } from "./services/dashboard-metrics-api";

// Components
import { HomeLayout } from "./components/HomeLayout";
import { DetailsLayout } from "./components/DetailsLayout";
import { DetailsKPIStrip } from "./components/DetailsKPIStrip";
import { ModuleDetails } from "./components/ModuleDetails";
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
  const [isGraphHovered, setIsGraphHovered] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [screen, setScreen] = useState<AppScreen>("home");
  const [selectedModule, setSelectedModule] = useState<string>("");

  const selected =
    data.find((item) => item.platform === activeMetric) ?? data[0];

  const unreadAlerts = notifications.filter(
    (item) => item.severity !== "ok",
  ).length;
  const hasNoData = !isLoading && !isError && data.length === 0;

  useEffect(() => {
    if (!data.length || isGraphHovered) return;

    const interval = window.setInterval(() => {
      setActiveMetric((current) => getNextMetric(data, current, "next"));
    }, 5000);

    return () => window.clearInterval(interval);
  }, [data, isGraphHovered]);

  const chartStyles = {
    "--accent": selected ? getStatusColor(selected.overallStatus) : "#6B7280",
    "--accent-2": selected
      ? getStatusSecondaryColor(selected.overallStatus)
      : "#D1D5DB",
  } as CSSProperties;

  return (
    <div>
      <Header />

      <main className="app-shell" style={chartStyles}>
        <header className="top-bar">
          <div>
            <p className="overview-label">Calm Operations Dashboard</p>
            <h1>Service Health Center</h1>
          </div>

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
        </header>

        <NotificationsPanel
          isVisible={showNotifications}
          notifications={notifications}
        />

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
                isGraphHovered={isGraphHovered}
                onMetricClick={(platform) =>
                  setActiveMetric(platform as MetricKey)
                }
                onGraphMouseEnter={() => setIsGraphHovered(true)}
                onGraphMouseLeave={() => setIsGraphHovered(false)}
                onNavigateToDetails={(platform) => {
                  const selectedPlatform = data.find(
                    (item) => item.platform === platform,
                  );
                  setSelectedModule(selectedPlatform?.modules[0] || "");
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
                <DetailsKPIStrip selected={selected} />

                <section className="details-split-layout">
                  <section className="overview-card details-graph">
                    <div className="overview-header">
                      <div>
                        <p className="overview-label">
                          Service Health Overview
                        </p>
                        <h2>{selected?.platform} Platform Status</h2>
                        <p className="overview-subtitle">
                          Real-time service health monitoring and status
                          tracking.
                        </p>
                      </div>
                    </div>

                    <div className="service-status-display">
                      <div className="status-indicator">
                        <div
                          className={`status-circle ${selected?.overallStatus.toLowerCase()}`}
                        >
                          <span className="status-text">
                            {selected?.overallStatus}
                          </span>
                        </div>
                        <div className="status-details">
                          <h3>Platform Status</h3>
                          <p>
                            Last updated:{" "}
                            {selected?.timestamp
                              ? new Date(selected.timestamp).toLocaleString()
                              : "N/A"}
                          </p>
                          <p>Modules: {selected?.modules.length}</p>
                          <p>
                            Telemetry:{" "}
                            <a
                              href={selected?.telemetryPath}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Logs
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="overview-card composition-card">
                    <h3>Module Details</h3>
                    <p className="overview-subtitle">
                      Status and dependencies for{" "}
                      {selectedModule || "selected module"}.
                    </p>
                    <div className="module-details">
                      <ModuleDetails
                        selected={selected}
                        selectedModule={selectedModule}
                      />
                    </div>
                  </section>
                </section>
              </DetailsLayout>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default App;
