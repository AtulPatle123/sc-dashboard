import React from "react";
import type { PlatformHealth } from "../models/dashboard";

interface PlatformLinksProps {
  selected: PlatformHealth | undefined;
}

export const PlatformLinks: React.FC<PlatformLinksProps> = ({ selected }) => {
  return (
    <div className="platform-links">
      {selected?.telemetryPath && (
        <a
          href={selected.telemetryPath}
          target="_blank"
          rel="noopener noreferrer"
          className="platform-link"
        >
          View Telemetry
        </a>
      )}
      {selected?.logsDirectory && (
        <a
          href={selected.logsDirectory}
          target="_blank"
          rel="noopener noreferrer"
          className="platform-link"
        >
          View Logs
        </a>
      )}
    </div>
  );
};
