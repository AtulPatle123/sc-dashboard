import React, { useState } from "react";
import {
  FiRefreshCw,
  FiCheckCircle,
  FiAlertTriangle,
  FiClock,
  FiHash,
  FiPlay,
  FiStopCircle,
  FiCode,
  FiZap,
} from "react-icons/fi";
import { JOB_NAMES } from "../constants/jobs.constants";
import { fetchJobStatus } from "../services/jobs-api";
import { formatDateTime, calcDuration, getStatusMeta } from "../utils/job.helper";
import type { JobStatusResponse, FetchState, JobsTabProps } from "../types/jobs-tab.types";

/* ─── Skeleton ───────────────────────────────────────────── */
const ResultSkeleton: React.FC = () => (
  <div className="job-result-card job-result-skeleton">
    <div className="job-result-skeleton-header">
      <div className="skeleton-line" style={{ width: "45%", height: 22 }} />
      <div className="skeleton-line" style={{ width: 90, height: 28, borderRadius: 20 }} />
    </div>
    <div className="job-result-stats-grid">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="job-result-stat">
          <div className="skeleton-line" style={{ width: "60%", height: 11, marginBottom: 6 }} />
          <div className="skeleton-line" style={{ width: "80%", height: 15 }} />
        </div>
      ))}
    </div>
  </div>
);

/* ─── Result Card ────────────────────────────────────────── */
const JobResultCard: React.FC<{ data: JobStatusResponse }> = ({ data }) => {
  const statusMeta = getStatusMeta(data.status);
  const { Icon } = statusMeta;
  const duration = calcDuration(data.startTime, data.endTime);
  const exitMeta = getStatusMeta(data.exitCode);
  const ExitIcon = exitMeta.Icon;

  return (
    <div className="job-result-card" style={{ borderTopColor: statusMeta.border }}>
      <div className="job-result-header">
        <div className="job-result-title-row">
          <span className="job-result-name">{data.jobName}</span>
          <span
            className="job-result-status-badge"
            style={{ color: statusMeta.color, background: statusMeta.bg, borderColor: statusMeta.border }}
          >
            <Icon size={13} />
            {data.status}
          </span>
        </div>
      </div>

      <div className="job-result-stats-grid">
        <div className="job-result-stat">
          <span className="job-result-stat-label"><FiHash size={11} /> Job Instance ID</span>
          <span className="job-result-stat-val">{data.jobInstanceId ?? "—"}</span>
        </div>
        <div className="job-result-stat">
          <span className="job-result-stat-label"><FiZap size={11} /> Job Execution ID</span>
          <span className="job-result-stat-val">{data.jobExecutionId ?? "—"}</span>
        </div>
        <div className="job-result-stat">
          <span className="job-result-stat-label"><FiPlay size={11} /> Start Time</span>
          <span className="job-result-stat-val">{formatDateTime(data.startTime)}</span>
        </div>
        <div className="job-result-stat">
          <span className="job-result-stat-label"><FiStopCircle size={11} /> End Time</span>
          <span className="job-result-stat-val">{formatDateTime(data.endTime)}</span>
        </div>
        <div className="job-result-stat">
          <span className="job-result-stat-label"><FiClock size={11} /> Duration</span>
          <span className="job-result-stat-val job-result-stat-mono">{duration}</span>
        </div>
        <div className="job-result-stat">
          <span className="job-result-stat-label"><FiCode size={11} /> Exit Code</span>
          <span className="job-result-stat-val" style={{ color: exitMeta.color, fontWeight: 700 }}>
            <ExitIcon size={12} style={{ marginRight: 4, verticalAlign: "middle" }} />
            {data.exitCode || "—"}
          </span>
        </div>
      </div>

      {data.errorMessage && (
        <div className="job-result-error-row">
          <FiAlertTriangle size={13} />
          <span>{data.errorMessage}</span>
        </div>
      )}

      {!data.errorMessage && (
        <div className="job-result-ok-row">
          <FiCheckCircle size={13} />
          No errors reported
        </div>
      )}
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────────── */
export const JobsTab: React.FC<JobsTabProps> = () => {
  const [selectedJob, setSelectedJob] = useState<string>(JOB_NAMES[0]);
  const [fetchState, setFetchState] = useState<FetchState>("idle");
  const [result, setResult] = useState<JobStatusResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isMock, setIsMock] = useState<boolean>(false);

  const handleCheckStatus = async () => {
    setFetchState("loading");
    setResult(null);
    setErrorMsg("");
    setIsMock(false);

    const { data, isMock: mock, errorMsg: err } = await fetchJobStatus(selectedJob);
    setResult(data);
    setIsMock(mock);
    setErrorMsg(err);
    setFetchState("success");
  };

  return (
    <div className="jobs-tab-root">
      {/* Controls bar */}
      <div className="jobs-controls-bar">
        <div className="jobs-controls-left">
          <div className="jobs-select-wrap">
            <label className="jobs-select-label">Job Name</label>
            <select
              className="jobs-select jobs-select-wide"
              value={selectedJob}
              onChange={(e) => {
                setSelectedJob(e.target.value);
                setFetchState("idle");
                setResult(null);
              }}
            >
              {JOB_NAMES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="jobs-controls-right">
          <button
            className="jobs-check-btn"
            onClick={handleCheckStatus}
            disabled={fetchState === "loading"}
          >
            <FiRefreshCw
              size={14}
              style={{ animation: fetchState === "loading" ? "spin 0.9s linear infinite" : "none" }}
            />
            {fetchState === "loading" ? "Checking…" : "Check Latest Status"}
          </button>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="jobs-scroll-body">
        {fetchState === "idle" && (
          <div className="jobs-fallback">
            <div className="tab-empty-icon"><FiZap size={36} /></div>
            <h3>Select a job and check its latest status</h3>
            <p>
              Choose a job from the dropdown above and click{" "}
              <strong>Check Latest Status</strong> to fetch the most recent execution details.
            </p>
          </div>
        )}

        {fetchState === "loading" && <ResultSkeleton />}

        {fetchState === "success" && result && (
          <div className="job-result-wrap">
            {isMock && (
              <div className="job-mock-banner">
                <FiAlertTriangle size={15} />
                <div className="job-mock-banner-text">
                  <strong>API unreachable</strong> — showing sample data.
                  <span className="job-mock-banner-reason">{errorMsg}</span>
                </div>
                <button className="job-mock-retry-btn" onClick={handleCheckStatus}>
                  <FiRefreshCw size={12} /> Retry
                </button>
              </div>
            )}

            <JobResultCard data={result} />

            <details className="job-raw-json">
              <summary>
                <FiCode size={12} /> View raw response
              </summary>
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
};
