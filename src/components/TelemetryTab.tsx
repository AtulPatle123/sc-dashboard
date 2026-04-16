import React from "react";
import { FaChartLine } from "react-icons/fa6";
import type { TelemetryTabProps } from "../types/telemetry-tab.types";

export const TelemetryTab: React.FC<TelemetryTabProps> = ({
  selectedModule,
  telemetryPath,
}) => (
  <div className="tab-empty-state">
    <div className="tab-empty-icon">
      <FaChartLine size={40} />
    </div>
    <h3>Telemetry</h3>
    <p>
      View real-time telemetry data for <strong>{selectedModule}</strong>.
    </p>
    {telemetryPath && (
      <a
        href={telemetryPath}
        target="_blank"
        rel="noopener noreferrer"
        className="tab-ext-link"
      >
        <i className="bi bi-box-arrow-up-right" /> Open Telemetry Dashboard
      </a>
    )}
  </div>
);
