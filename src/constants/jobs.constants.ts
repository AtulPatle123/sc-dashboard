import type { JobStatusResponse } from "../types/jobs-tab.types";

export enum JobStatus {
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  RUNNING = "RUNNING",
  STARTED = "STARTED",
  STOPPED = "STOPPED",
  STOPPING = "STOPPING",
  UP = "UP",
  DOWN = "DOWN",
}

export const JOB_NAMES = [
  "PimSync",
  "JOB_RRL_SYNC",
  "JOB_TAB_SPEC",
  "JOB_SELECTOR_SYNC",
  "IndexerJob",
  "JOB_PRODUCT_SYNC",
  "JOB_AR_SYNC",
  "JOB_GPF_SYNC",
] as const;

export const JOBS_API_BASE_URL =
  "http://localhost:5051/sc-telemetry-services/job-status/latest";

export const MOCK_JOB_RESULT: JobStatusResponse = {
  jobName: "JOB_SELECTOR_SYNC",
  jobInstanceId: 373,
  jobExecutionId: 437,
  status: JobStatus.COMPLETED,
  startTime: "2026-04-16T01:04:31.253317",
  endTime: "2026-04-16T01:21:50.170411",
  exitCode: JobStatus.COMPLETED,
  errorMessage: "",
};
