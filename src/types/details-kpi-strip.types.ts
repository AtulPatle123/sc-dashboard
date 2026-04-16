import type { PlatformHealth } from "../models/dashboard";

export interface DetailsKPIStripProps {
  selected: PlatformHealth | undefined;
  selectedModule: string;
}
