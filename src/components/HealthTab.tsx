import React from "react";
import { DependencyCard } from "./DependencyCard";
import { DependencyStatusFooter } from "./DependencyStatusFooter";
import { DependencyDonutChart } from "./DependencyDonutChart";
import { DependencyStatus } from "../constants/dependency-status";
import { buildPieData, getModuleInfo } from "../utils/dependency.helper";
import type { HealthTabProps } from "../types/health-tab.types";

const STATUS_ARROW: Record<string, string> = {
  [DependencyStatus.UP]: "↑",
  [DependencyStatus.DOWN]: "↓",
};

export const HealthTab: React.FC<HealthTabProps> = ({ selected, selectedModule }) => {
  const moduleInfo = getModuleInfo(selected?.modulesResponse, selectedModule);

  const deps = moduleInfo?.dependencies ?? [];
  const upCount = deps.filter((d) => d.status === DependencyStatus.UP).length;
  const warnCount = deps.filter((d) => d.status === DependencyStatus.WARN).length;
  const downCount = deps.filter((d) => d.status === DependencyStatus.DOWN).length;

  const pieData = buildPieData(upCount, warnCount, downCount);
  const statusArrow = STATUS_ARROW[moduleInfo?.status ?? ""] ?? "⚠";
  const statusClass = (moduleInfo?.status ?? "unknown").toLowerCase();

  return (
    <div className="health-content">
      {/* Module Info Strip */}
      <div className="module-info-strip">
        <div className="module-info-cell">
          <span className="info-cell-label">MODULE</span>
          <span className="info-cell-value">{selectedModule || "—"}</span>
        </div>
        <div className="module-info-cell">
          <span className="info-cell-label">VERSION</span>
          <span className="info-cell-value">{moduleInfo?.version ?? "—"}</span>
        </div>
        <div className="module-info-cell">
          <span className="info-cell-label">INSTANCES</span>
          <span className="info-cell-value">{moduleInfo?.noOfInstances ?? "—"}</span>
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
        <div className="dep-cards-area">
          {deps.length > 0 ? (
            <div className="dep-cards-grid">
              {deps.map((dep, i) => (
                <DependencyCard key={i} dep={dep} />
              ))}
            </div>
          ) : (
            <p className="no-deps-msg">
              <i
                className="bi bi-inbox"
                style={{ fontSize: "1.5rem", display: "block", marginBottom: 8 }}
              />
              No dependencies found
            </p>
          )}

          {deps.length > 0 && (
            <DependencyStatusFooter
              upCount={upCount}
              warnCount={warnCount}
              downCount={downCount}
              timestamp={selected?.timestamp}
            />
          )}
        </div>

        <DependencyDonutChart
          pieData={pieData}
          totalDeps={deps.length}
          moduleName={selectedModule}
        />
      </div>
    </div>
  );
};
