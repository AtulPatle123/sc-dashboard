import type { Dependency } from "../models/dashboard";

export interface DepIconProps {
  name: string;
  status: string;
}

export interface DependencyCardProps {
  dep: Dependency;
}

export interface DependencyStatusFooterProps {
  upCount: number;
  warnCount: number;
  downCount: number;
  timestamp: string | undefined;
}

export interface PieEntry {
  name: string;
  value: number;
  fill: string;
}

export interface DependencyDonutChartProps {
  pieData: PieEntry[];
  totalDeps: number;
  moduleName: string;
}
