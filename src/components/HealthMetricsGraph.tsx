import React from "react";
import type { PlatformHealth } from "../models/dashboard";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { getStatusCounts, getPieChartData } from "../utils/statusHelper";

interface HealthMetricsGraphProps {
  selected: PlatformHealth | undefined;
  isLoading: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const HealthMetricsGraph: React.FC<HealthMetricsGraphProps> = ({
  selected,
  isLoading,
  onMouseEnter,
  onMouseLeave,
}) => {
  if (isLoading) {
    return <div className="loading">Loading service status…</div>;
  }

  const statusCounts = getStatusCounts(selected?.modulesResponse);
  const pieData = getPieChartData(statusCounts);

  return (
    <div
      className="service-status-graph"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      <div className="graph-summary">
        <div className="summary-item">
          <span className="summary-label">Total Services:</span>
          <span className="summary-value">
            {selected?.modulesResponse.length}
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Last Updated:</span>
          <span className="summary-value">
            {selected?.timestamp
              ? new Date(selected.timestamp).toLocaleString()
              : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};
