import React from "react";
import { FaHeart, FaChartLine, FaFileLines, FaDiagramProject } from "react-icons/fa6";

export type Tab = "health" | "telemetry" | "logs" | "jobs";

export interface TabConfig {
  icon: React.ReactNode;
  label: string;
}

export const TAB_CONFIG: Record<Tab, TabConfig> = {
  health: { icon: <FaHeart />, label: "Health" },
  telemetry: { icon: <FaChartLine />, label: "Telemetry" },
  logs: { icon: <FaFileLines />, label: "Logs" },
  jobs: { icon: <FaDiagramProject />, label: "Jobs" },
};

export const TABS = Object.keys(TAB_CONFIG) as Tab[];
