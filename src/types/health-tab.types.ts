import type { PlatformHealth } from "../models/dashboard";

export interface HealthTabProps {
  selected: PlatformHealth | undefined;
  selectedModule: string;
}
