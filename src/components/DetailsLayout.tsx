import React from "react";
import type { PlatformHealth } from "../models/dashboard";

interface DetailsLayoutProps {
  selected: PlatformHealth | undefined;
  selectedModule: string;
  onModuleSelect: (module: string) => void;
  children: React.ReactNode;
}

/** Resolve the status for a module name against the modulesResponse array. */
const resolveModuleStatus = (
  module: string,
  modulesResponse: PlatformHealth["modulesResponse"]
): "UP" | "DOWN" | "WARN" => {
  const mr = modulesResponse.find(
    (m) =>
      m.name === `sc-${module}` ||
      m.name === module ||
      m.name.endsWith(module) ||
      module.endsWith(m.name.replace(/^sc-/, ""))
  );
  const s = mr?.status;
  if (s === "DOWN") return "DOWN";
  if (s === "WARN") return "WARN";
  return "UP";
};

export const DetailsLayout: React.FC<DetailsLayoutProps> = ({
  selected,
  selectedModule,
  onModuleSelect,
  children,
}) => {
  const modulesResponse = selected?.modulesResponse ?? [];

  return (
    <div className="details-layout">
      {/* ── SE Green Sidebar ── */}
      <aside className="details-sidebar">
        <div className="sidebar-platform-label">
         <span className={`sidebar-status-dot dot-${selected?.overallStatus.toLocaleLowerCase()}`} />
          {selected?.platform ?? "Modules"}
        </div>

        <nav className="sidebar-nav">
          {selected?.modules.map((module) => {
            const status = resolveModuleStatus(module, modulesResponse);
            const isActive = selectedModule === module;
            return (
              <button
                key={module}
                className={`sidebar-item${isActive ? " active" : ""}`}
                onClick={() => onModuleSelect(module)}
                title={module}
              >
                <span className={`sidebar-status-dot dot-${status.toLowerCase()}`} />
                <span className="sidebar-item-text">{module}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* ── Main Content ── */}
      <div className="details-content">{children}</div>
    </div>
  );
};
