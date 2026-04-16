import React, { useState } from "react";
import { HealthTab } from "./HealthTab";
import { TelemetryTab } from "./TelemetryTab";
import { LogsTab } from "./LogsTab";
import { JobsTab } from "./JobsTab";
import { TAB_CONFIG, TABS } from "../constants/tab.constants";
import type { Tab } from "../constants/tab.constants";
import type { DetailsKPIStripProps } from "../types/details-kpi-strip.types";

export const DetailsKPIStrip: React.FC<DetailsKPIStripProps> = ({
  selected,
  selectedModule,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>("health");

  return (
    <div className="details-panel">
      <div className="details-tabs">
        {TABS.map((tab) => (
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

      {activeTab === "health" && (
        <HealthTab selected={selected} selectedModule={selectedModule} />
      )}
      {activeTab === "telemetry" && (
        <TelemetryTab
          selectedModule={selectedModule}
          telemetryPath={selected?.telemetryPath}
        />
      )}
      {activeTab === "logs" && (
        <LogsTab
          selectedModule={selectedModule}
          logsDirectory={selected?.logsDirectory}
        />
      )}
      {activeTab === "jobs" && <JobsTab selectedModule={selectedModule} />}
    </div>
  );
};
