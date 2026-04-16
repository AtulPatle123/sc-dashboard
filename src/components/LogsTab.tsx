import React from "react";
import { FaFileLines } from "react-icons/fa6";
import type { LogsTabProps } from "../types/logs-tab.types";

export const LogsTab: React.FC<LogsTabProps> = ({ selectedModule, logsDirectory }) => (
  <div className="tab-empty-state">
    <div className="tab-empty-icon">
      <FaFileLines size={40} />
    </div>
    <h3>Logs</h3>
    <p>
      Access log files for <strong>{selectedModule}</strong>.
    </p>
    {logsDirectory && (
      <a
        href={logsDirectory}
        target="_blank"
        rel="noopener noreferrer"
        className="tab-ext-link"
      >
        <i className="bi bi-box-arrow-up-right" /> Open Logs Directory
      </a>
    )}
  </div>
);
