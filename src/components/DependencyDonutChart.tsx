import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { FaDiagramProject } from "react-icons/fa6";
import type { DependencyDonutChartProps } from "../types/dependency.types";

export const DependencyDonutChart: React.FC<DependencyDonutChartProps> = ({
  pieData,
  totalDeps,
  moduleName,
}) => (
  <div className="dep-donut-area">
    <div className="dep-donut-header">
      <h4 className="dep-chart-title">
        <FaDiagramProject />
        Dependency Status
      </h4>
      <p className="dep-chart-sub">
        {totalDeps} dependenc{totalDeps === 1 ? "y" : "ies"} · {moduleName}
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
          <span className="dep-legend-dot" style={{ background: d.fill }} />
          <span className="dep-legend-name">{d.name}</span>
          <span className="dep-legend-count">{d.value}</span>
        </div>
      ))}
    </div>
  </div>
);
