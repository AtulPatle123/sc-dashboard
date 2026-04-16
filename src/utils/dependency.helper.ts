import type { ModuleResponse } from "../models/dashboard";
import { DependencyStatus, STATUS_COLORS } from "../constants/dependency-status";
import type { PieEntry } from "../types/dependency.types";

/** keyword groups → human-readable dependency type label */
const DEP_TYPE_MAP: Array<[string[], string]> = [
  [["redis"], "Cache"],
  [["mongo"], "Document DB"],
  [["mysql", "postgre"], "SQL DB"],
  [["kafka", "rabbit"], "Message Broker"],
  [["s3"], "Object Storage"],
  [["elastic"], "Search Engine"],
];

export function getDependencyType(name: string): string {
  const n = name.toLowerCase();
  for (const [keywords, label] of DEP_TYPE_MAP) {
    if (keywords.some((k) => n.includes(k))) return label;
  }
  return "Service";
}

export function buildPieData(
  upCount: number,
  warnCount: number,
  downCount: number,
): PieEntry[] {
  const entries: PieEntry[] = [
    upCount > 0 && { name: DependencyStatus.UP, value: upCount, fill: STATUS_COLORS[DependencyStatus.UP] },
    warnCount > 0 && { name: DependencyStatus.WARN, value: warnCount, fill: STATUS_COLORS[DependencyStatus.WARN] },
    downCount > 0 && { name: DependencyStatus.DOWN, value: downCount, fill: STATUS_COLORS[DependencyStatus.DOWN] },
  ].filter(Boolean) as PieEntry[];

  return entries.length > 0
    ? entries
    : [{ name: DependencyStatus.UP, value: 1, fill: STATUS_COLORS[DependencyStatus.UP] }];
}

export function getModuleInfo(
  modulesResponse: ModuleResponse[] | undefined,
  selectedModule: string,
): ModuleResponse | undefined {
  if (!modulesResponse?.length) return undefined;
  return (
    modulesResponse.find(
      (m) =>
        m.name === `sc-${selectedModule}` ||
        m.name === selectedModule ||
        m.name.endsWith(selectedModule),
    ) ?? modulesResponse[0]
  );
}
