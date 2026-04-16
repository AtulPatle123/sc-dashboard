import type { ElementType } from "react";

export interface JobStatusResponse {
  jobName: string;
  jobInstanceId: number;
  jobExecutionId: number;
  status: string;
  startTime: string;
  endTime: string;
  exitCode: string;
  errorMessage: string;
}

export interface StatusMeta {
  color: string;
  bg: string;
  border: string;
  Icon: ElementType;
}

export type FetchState = "idle" | "loading" | "success" | "error";

export interface JobsTabProps {
  selectedModule: string;
}
