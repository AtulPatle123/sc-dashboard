import React, { useState } from "react";
import type { PlatformHealth } from "../models/dashboard";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

interface DetailsKPIStripProps {
  selected: PlatformHealth | undefined;
  selectedModule: string;
}

type Tab = "health" | "telemetry" | "logs";

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
    upCount > 0 && { name: "UP", value: upCount, fill: "#10B981" },
    warnCount > 0 && { name: "WARN", value: warnCount, fill: "#F59E0B" },
    downCount > 0 && { name: "DOWN", value: downCount, fill: "#EF4444" },
  ].filter(Boolean) as Array<{ name: string; value: number; fill: string }>;

  if (pieData.length === 0) {
    pieData.push({ name: "UP", value: 1, fill: "#10B981" });
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
      {/* Tab Bar */}
      <div className="details-tabs">
        {(["health", "telemetry", "logs"] as Tab[]).map((tab) => (
          <button
            key={tab}
            className={`details-tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Health Tab */}
      {activeTab === "health" && (
        <div className="health-content">
          {/* Module Info Strip */}
          <div className="module-info-strip">
            <div className="module-info-cell">
              <span className="info-cell-label">MODULE</span>
              <span className="info-cell-value" title={selectedModule}>
                {selectedModule || "—"}
              </span>
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

          {/* Dependencies + Donut Chart */}
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
                        <span
                          className={`dep-dot dot-${dep.status.toLowerCase()}`}
                        />
                        <span className="dep-card-name">{dep.name}</span>
                      </div>
                      <div className="dep-card-footer">
                        {dep.status === "UP" && (
                          <span className="dep-card-status text-up">↑ UP</span>
                        )}
                        {dep.status === "DOWN" && (
                          <span className="dep-card-status text-down">
                            ↓ DOWN
                          </span>
                        )}
                        {dep.status === "WARN" && (
                          <span className="dep-card-status text-warn">
                            ⚠ WARN
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-deps-msg">No dependencies found</p>
              )}
            </div>

            {/* Donut Chart */}
            <div className="dep-donut-area">
              <h4 className="dep-chart-title">Dependency Status</h4>
              <p className="dep-chart-sub">
                {deps.length} dependenc{deps.length === 1 ? "y" : "ies"} for{" "}
                {selectedModule}
              </p>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={78}
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
                    <span>
                      {d.name}: {d.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Telemetry Tab */}
      {activeTab === "telemetry" && (
        <div className="tab-empty-state">
          <div className="tab-empty-icon">
            <i
              className="bi bi-graph-up-arrow"
              style={{ fontSize: "3rem", color: "var(--se-green-dark)" }}
            />
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
              Open Telemetry Dashboard ↗
            </a>
          )}
        </div>
      )}

      {/* Logs Tab */}
      {activeTab === "logs" && (
        <div className="tab-empty-state">
          <div className="tab-empty-icon">📋</div>
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
              Open Logs Directory ↗
            </a>
          )}
        </div>
      )}
    </div>
  );
};
