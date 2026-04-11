import React from "react";
import type { PlatformHealth } from "../models/dashboard";

interface PlatformSummaryProps {
  selected: PlatformHealth | undefined;
}

export const PlatformSummary: React.FC<PlatformSummaryProps> = ({
  selected,
}) => {
  return (
    <aside className="side-insights">
      <h3>Platform Summary</h3>
      <p className="overview-subtitle">
        Key information about {selected?.platform} platform health.
      </p>
      <ul>
        <li>Platform: {selected?.platform}</li>
        <li>Overall Status: {selected?.overallStatus}</li>
        <li>Total Services: {selected?.modulesResponse.length}</li>
        <li>
          Push Notifications:{" "}
          {selected?.pushNotificationEligible ? "Enabled" : "Disabled"}
        </li>
        <li>
          Last Check:{" "}
          {selected?.timestamp
            ? new Date(selected.timestamp).toLocaleTimeString()
            : "N/A"}
        </li>
      </ul>
    </aside>
  );
};
