import { JOBS_API_BASE_URL, MOCK_JOB_RESULT } from "../constants/jobs.constants";
import type { JobStatusResponse } from "../types/jobs-tab.types";

export interface JobStatusResult {
  data: JobStatusResponse;
  isMock: boolean;
  errorMsg: string;
}

export async function fetchJobStatus(jobName: string): Promise<JobStatusResult> {
  try {
    const res = await fetch(`${JOBS_API_BASE_URL}/${jobName}`);
    if (!res.ok) {
      throw new Error(`Server responded with ${res.status} ${res.statusText}`);
    }
    const data: JobStatusResponse = await res.json();
    return { data, isMock: false, errorMsg: "" };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Unexpected error";
    return {
      data: { ...MOCK_JOB_RESULT, jobName },
      isMock: true,
      errorMsg,
    };
  }
}
