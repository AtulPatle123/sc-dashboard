import React, { useState } from "react";
import type { PlatformHealth } from "../models/dashboard";
import { JobsTab } from "./JobsTab";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import {
  SiRedis,
  SiMongodb,
  SiMysql,
  SiPostgresql,
  SiApachecassandra,
  SiRabbitmq,
  SiApachekafka,
  SiElasticsearch,
} from "react-icons/si";

import {
  FaDatabase,
  FaServer,
  FaCloud,
  FaBolt,
  FaHeart,
  FaChartLine,
  FaFileLines,
  FaDiagramProject,
} from "react-icons/fa6";

interface DetailsKPIStripProps {
  selected: PlatformHealth | undefined;
  selectedModule: string;
}

type Tab = "health" | "telemetry" | "logs" | "jobs";

const TAB_CONFIG: Record<Tab, { icon: React.ReactNode; label: string }> = {
  health: { icon: <FaHeart />, label: "Health" },
  telemetry: { icon: <FaChartLine />, label: "Telemetry" },
  logs: { icon: <FaFileLines />, label: "Logs" },
  jobs: { icon: <FaDiagramProject />, label: "Jobs" },
};

interface DepIconProps {
  name: string;
  status: string;
}

const DepIcon: React.FC<DepIconProps> = ({ name, status }) => {
  const n = name.toLowerCase();

  const colorMap: Record<string, string> = {
    up: "#10b981",
    warn: "#f59e0b",
    down: "#ef4444",
  };

  const color = colorMap[status.toLowerCase()] ?? "#64748b";
  const size = 22;

  if (n.includes("redis") || n.includes("valkey"))
    return <SiRedis size={size} color="#e0312d" style={{ flexShrink: 0 }} />;
  if (n.includes("mongo"))
    return <SiMongodb size={size} color="#47a248" style={{ flexShrink: 0 }} />;
  if (n.includes("mysql"))
    return <SiMysql size={size} color="#4479a1" style={{ flexShrink: 0 }} />;
  if (n.includes("postgre"))
    return (
      <SiPostgresql size={size} color="#336791" style={{ flexShrink: 0 }} />
    );
  if (n.includes("cassandra"))
    return (
      <SiApachecassandra
        size={size}
        color="#1287b1"
        style={{ flexShrink: 0 }}
      />
    );
  if (n.includes("rabbit"))
    return <SiRabbitmq size={size} color="#ff6600" style={{ flexShrink: 0 }} />;
  if (n.includes("kafka"))
    return (
      <SiApachekafka size={size} color="#231f20" style={{ flexShrink: 0 }} />
    );
  if (n.includes("s3") || n.includes("storage"))
    return <FaCloud size={size} color="#e25444" style={{ flexShrink: 0 }} />;
  if (n.includes("elastic"))
    return (
      <SiElasticsearch size={size} color="#00bfb3" style={{ flexShrink: 0 }} />
    );
  if (n.includes("bolt") || n.includes("cache"))
    return <FaBolt size={size} color={color} style={{ flexShrink: 0 }} />;
  if (n.includes("cloud"))
    return <FaCloud size={size} color={color} style={{ flexShrink: 0 }} />;
  if (n.includes("db") || n.includes("database"))
    return <FaDatabase size={size} color={color} style={{ flexShrink: 0 }} />;

  return <FaServer size={size} color={color} style={{ flexShrink: 0 }} />;
};

export const DetailsKPIStrip: React.FC<DetailsKPIStripProps> = ({
  selected,
  selectedModule,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>("health");

  const moduleInfo =
    selected?.modulesResponse.find(
      (m) =>
        m.name === `sc-${selectedModule}` ||
        m.name === selectedModule ||
        m.name.endsWith(selectedModule),
    ) ?? selected?.modulesResponse[0];

  const deps = moduleInfo?.dependencies ?? [];

  const upCount = deps.filter((d) => d.status === "UP").length;
  const warnCount = deps.filter((d) => d.status === "WARN").length;
  const downCount = deps.filter((d) => d.status === "DOWN").length;

  const pieData = [
    upCount > 0 && { name: "UP", value: upCount, fill: "#10b981" },
    warnCount > 0 && { name: "WARN", value: warnCount, fill: "#f59e0b" },
    downCount > 0 && { name: "DOWN", value: downCount, fill: "#ef4444" },
  ].filter(Boolean) as Array<{ name: string; value: number; fill: string }>;

  if (pieData.length === 0) {
    pieData.push({ name: "UP", value: 1, fill: "#10b981" });
  }

  const statusArrow =
    moduleInfo?.status === "UP"
      ? "↑"
      : moduleInfo?.status === "DOWN"
        ? "↓"
        : "⚠";

  const statusClass = (moduleInfo?.status ?? "unknown").toLowerCase();

  return (
    <div className="details-panel">
      {/* Tabs */}
      <div className="details-tabs">
        {(["health", "telemetry", "logs", "jobs"] as Tab[]).map((tab) => (
          <button
            key={tab}
            className={`details-tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            <span className="tab-icon">{TAB_CONFIG[tab].icon}</span>
            {TAB_CONFIG[tab].label}
          </button>
        ))}
      </div>

      {/* Health Tab */}
      {activeTab === "health" && (
        <div className="health-content">
          {/* Module Info */}
          <div className="module-info-strip">
            <div className="module-info-cell">
              <span className="info-cell-label">MODULE</span>
              <span className="info-cell-value">{selectedModule || "—"}</span>
            </div>

            <div className="module-info-cell">
              <span className="info-cell-label">VERSION</span>
              <span className="info-cell-value">
                {moduleInfo?.version ?? "—"}
              </span>
            </div>

            <div className="module-info-cell">
              <span className="info-cell-label">INSTANCES</span>
              <span className="info-cell-value">
                {moduleInfo?.noOfInstances ?? "—"}
              </span>
            </div>

            <div className="module-info-cell">
              <span className="info-cell-label">STATUS</span>
              <span className={`module-status-badge badge-${statusClass}`}>
                {statusArrow} {moduleInfo?.status ?? "—"}
              </span>
            </div>
          </div>

          {/* Dependencies + Chart */}
          <div className="health-split">
            {/* Dependency Cards */}
            <div className="dep-cards-area">
              {deps.length > 0 ? (
                <div className="dep-cards-grid">
                  {deps.map((dep, i) => (
                    <div
                      key={i}
                      className={`dep-card dep-card-${dep.status.toLowerCase()}`}
                    >
                      <div className="dep-card-header">
                        <DepIcon name={dep.name} status={dep.status} />
                        <span className="dep-card-name">{dep.name}</span>
                      </div>
                      <div className="dep-card-meta">
                        <span className="dep-card-type">
                          {dep.name.toLowerCase().includes("redis")
                            ? "Cache"
                            : dep.name.toLowerCase().includes("mongo")
                              ? "Document DB"
                              : dep.name.toLowerCase().includes("mysql") ||
                                  dep.name.toLowerCase().includes("postgre")
                                ? "SQL DB"
                                : dep.name.toLowerCase().includes("kafka") ||
                                    dep.name.toLowerCase().includes("rabbit")
                                  ? "Message Broker"
                                  : dep.name.toLowerCase().includes("s3")
                                    ? "Object Storage"
                                    : dep.name.toLowerCase().includes("elastic")
                                      ? "Search Engine"
                                      : "Service"}
                        </span>
                      </div>
                      <div className="dep-card-footer">
                        {dep.status === "UP" && (
                          <span className="dep-card-status text-up">
                            <i className="bi bi-check-circle-fill" /> UP
                          </span>
                        )}
                        {dep.status === "DOWN" && (
                          <span className="dep-card-status text-down">
                            <i className="bi bi-x-circle-fill dep-status-icon-down" />{" "}
                            DOWN
                          </span>
                        )}
                        {dep.status === "WARN" && (
                          <span className="dep-card-status text-warn">
                            <i className="bi bi-exclamation-triangle-fill" />{" "}
                            WARN
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-deps-msg">
                  <i
                    className="bi bi-inbox"
                    style={{
                      fontSize: "1.5rem",
                      display: "block",
                      marginBottom: 8,
                    }}
                  />
                  No dependencies found
                </p>
              )}

              {/* ── Service status footer ── */}
              {deps.length > 0 && (
                <div className="dep-status-footer">
                  <div className="dep-status-footer-left">
                    {upCount > 0 && (
                      <span className="dep-footer-badge dep-footer-up">
                        <i className="bi bi-check-circle-fill" />
                        {upCount} UP
                      </span>
                    )}
                    {warnCount > 0 && (
                      <span className="dep-footer-badge dep-footer-warn">
                        <i className="bi bi-exclamation-triangle-fill" />
                        {warnCount} WARN
                      </span>
                    )}
                    {downCount > 0 && (
                      <span className="dep-footer-badge dep-footer-down">
                        <i className="bi bi-x-circle-fill" />
                        {downCount} DOWN
                      </span>
                    )}
                  </div>
                  <div className="dep-status-footer-right">
                    {downCount === 0 ? (
                      <span className="dep-footer-time dep-footer-time-up">
                        <i className="bi bi-arrow-up-circle" />
                        Last up:&nbsp;
                        <strong>
                          {selected?.timestamp
                            ? new Date(selected.timestamp).toLocaleString()
                            : "just now"}
                        </strong>
                      </span>
                    ) : (
                      <span className="dep-footer-time dep-footer-time-down">
                        <i className="bi bi-arrow-down-circle" />
                        Last down detected:&nbsp;
                        <strong>
                          {selected?.timestamp
                            ? new Date(selected.timestamp).toLocaleString()
                            : "recently"}
                        </strong>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Donut Chart */}
            <div className="dep-donut-area">
              <div className="dep-donut-header">
                <h4 className="dep-chart-title">
                  <FaDiagramProject />
                  Dependency Status
                </h4>
                <p className="dep-chart-sub">
                  {deps.length} dependenc{deps.length === 1 ? "y" : "ies"} ·{" "}
                  {selectedModule}
                </p>
              </div>

              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={76}
                    dataKey="value"
                    strokeWidth={2}
                    stroke="#fff"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [value, name]}
                    contentStyle={{ borderRadius: 8, fontSize: 13 }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="dep-chart-legend">
                {pieData.map((d, i) => (
                  <div key={i} className="dep-legend-item">
                    <span
                      className="dep-legend-dot"
                      style={{ background: d.fill }}
                    />
                    <span className="dep-legend-name">{d.name}</span>
                    <span className="dep-legend-count">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Telemetry Tab ── */}
      {activeTab === "telemetry" && (
        <div className="tab-empty-state">
          <div className="tab-empty-icon">
            <FaChartLine size={40} />
          </div>
          <h3>Telemetry</h3>
          <p>
            View real-time telemetry data for <strong>{selectedModule}</strong>.
          </p>
          {selected?.telemetryPath && (
            <a
              href={selected.telemetryPath}
              target="_blank"
              rel="noopener noreferrer"
              className="tab-ext-link"
            >
              <i className="bi bi-box-arrow-up-right" /> Open Telemetry
              Dashboard
            </a>
          )}
        </div>
      )}

      {/* Logs */}
      {activeTab === "logs" && (
        <div className="tab-empty-state">
          <div className="tab-empty-icon"><FaFileLines size={40} /></div>
          <h3>Logs</h3>
          <p>
            Access log files for <strong>{selectedModule}</strong>.
          </p>
          {selected?.logsDirectory && (
            <a
              href={selected.logsDirectory}
              target="_blank"
              rel="noopener noreferrer"
              className="tab-ext-link"
            >
              <i className="bi bi-box-arrow-up-right" /> Open Logs Directory
            </a>
          )}
        </div>
      )}

      {activeTab === "jobs" && <JobsTab selectedModule={selectedModule} />}
    </div>
  );
};
