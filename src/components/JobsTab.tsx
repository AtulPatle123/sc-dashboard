import React, { useState } from "react";
import {
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiClock,
  FiHash,
  FiPlay,
  FiStopCircle,
  FiCode,
  FiZap,
} from "react-icons/fi";

/* ─── Constants ──────────────────────────────────────────── */
const JOB_NAMES = [
  "PimSync",
  "JOB_RRL_SYNC",
  "JOB_TAB_SPEC",
  "JOB_SELECTOR_SYNC",
  "IndexerJob",
  "JOB_PRODUCT_SYNC",
  "JOB_AR_SYNC",
  "JOB_GPF_SYNC",
] as const;

const BASE_URL = "http://localhost:5051/sc-telemetry-services/job-status/latest";

/* ─── Types ──────────────────────────────────────────────── */
interface JobStatusResponse {
  jobName: string;
  jobInstanceId: number;
  jobExecutionId: number;
  status: string;
  startTime: string;
  endTime: string;
  exitCode: string;
  errorMessage: string;
}

type FetchState = "idle" | "loading" | "success" | "error";

/* ─── Mock fallback data ─────────────────────────────────── */
const MOCK_RESULT: JobStatusResponse = {
  jobName: "JOB_SELECTOR_SYNC",
  jobInstanceId: 373,
  jobExecutionId: 437,
  status: "COMPLETED",
  startTime: "2026-04-16T01:04:31.253317",
  endTime: "2026-04-16T01:21:50.170411",
  exitCode: "COMPLETED",
  errorMessage: "",
};

/* ─── Helpers ────────────────────────────────────────────── */
function formatDateTime(iso: string): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return iso;
  }
}

function calcDuration(start: string, end: string): string {
  if (!start || !end) return "—";
  try {
    const ms = new Date(end).getTime() - new Date(start).getTime();
    if (ms < 0) return "—";
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    if (h > 0) return `${h}h ${m % 60}m ${s % 60}s`;
    if (m > 0) return `${m}m ${s % 60}s`;
    return `${s}s`;
  } catch {
    return "—";
  }
}

function getStatusMeta(status: string): {
  color: string;
  bg: string;
  border: string;
  Icon: React.ElementType;
} {
  const s = status?.toUpperCase();
  if (s === "COMPLETED" || s === "UP")
    return { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", Icon: FiCheckCircle };
  if (s === "FAILED" || s === "DOWN")
    return { color: "#dc2626", bg: "#fff5f5", border: "#fecaca", Icon: FiXCircle };
  if (s === "RUNNING" || s === "STARTED")
    return { color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe", Icon: FiPlay };
  if (s === "STOPPED" || s === "STOPPING")
    return { color: "#64748b", bg: "#f8fafc", border: "#e2e8f0", Icon: FiStopCircle };
  return { color: "#d97706", bg: "#fffbeb", border: "#fde68a", Icon: FiAlertTriangle };
}

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
    <div
      className="job-result-card"
      style={{ borderTopColor: statusMeta.border }}
    >
      {/* Header */}
      <div className="job-result-header">
        <div className="job-result-title-row">
          <span className="job-result-name">{data.jobName}</span>
          <span
            className="job-result-status-badge"
            style={{
              color: statusMeta.color,
              background: statusMeta.bg,
              borderColor: statusMeta.border,
            }}
          >
            <Icon size={13} />
            {data.status}
          </span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="job-result-stats-grid">
        <div className="job-result-stat">
          <span className="job-result-stat-label">
            <FiHash size={11} /> Job Instance ID
          </span>
          <span className="job-result-stat-val">{data.jobInstanceId ?? "—"}</span>
        </div>

        <div className="job-result-stat">
          <span className="job-result-stat-label">
            <FiZap size={11} /> Job Execution ID
          </span>
          <span className="job-result-stat-val">{data.jobExecutionId ?? "—"}</span>
        </div>

        <div className="job-result-stat">
          <span className="job-result-stat-label">
            <FiPlay size={11} /> Start Time
          </span>
          <span className="job-result-stat-val">{formatDateTime(data.startTime)}</span>
        </div>

        <div className="job-result-stat">
          <span className="job-result-stat-label">
            <FiStopCircle size={11} /> End Time
          </span>
          <span className="job-result-stat-val">{formatDateTime(data.endTime)}</span>
        </div>

        <div className="job-result-stat">
          <span className="job-result-stat-label">
            <FiClock size={11} /> Duration
          </span>
          <span className="job-result-stat-val job-result-stat-mono">{duration}</span>
        </div>

        <div className="job-result-stat">
          <span className="job-result-stat-label">
            <FiCode size={11} /> Exit Code
          </span>
          <span
            className="job-result-stat-val"
            style={{ color: exitMeta.color, fontWeight: 700 }}
          >
            <ExitIcon size={12} style={{ marginRight: 4, verticalAlign: "middle" }} />
            {data.exitCode || "—"}
          </span>
        </div>
      </div>

      {/* Error message — only show when non-empty */}
      {data.errorMessage && (
        <div className="job-result-error-row">
          <FiAlertTriangle size={13} />
          <span>{data.errorMessage}</span>
        </div>
      )}

      {/* All clear row */}
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
interface JobsTabProps {
  selectedModule: string;
}

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

    try {
      const res = await fetch(`${BASE_URL}/${selectedJob}`);
      if (!res.ok) {
        throw new Error(`Server responded with ${res.status} ${res.statusText}`);
      }
      const json: JobStatusResponse = await res.json();
      setResult(json);
      setFetchState("success");
    } catch (err: unknown) {
      // API unavailable — fall back to mock data so the UI is still useful
      setErrorMsg(err instanceof Error ? err.message : "Unexpected error");
      setResult({ ...MOCK_RESULT, jobName: selectedJob });
      setIsMock(true);
      setFetchState("success");
    }
  };

  return (
    <div className="jobs-tab-root">
      {/* ── Controls bar ── */}
      <div className="jobs-controls-bar">
        <div className="jobs-controls-left">
          {/* Job Name dropdown */}
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
              style={{
                animation:
                  fetchState === "loading" ? "spin 0.9s linear infinite" : "none",
              }}
            />
            {fetchState === "loading" ? "Checking…" : "Check Latest Status"}
          </button>
        </div>
      </div>

      {/* ── Scrollable body ── */}
      <div className="jobs-scroll-body">
        {/* Idle — prompt */}
        {fetchState === "idle" && (
          <div className="jobs-fallback">
            <div className="tab-empty-icon"><FiZap size={36} /></div>
            <h3>Select a job and check its latest status</h3>
            <p>
              Choose a job from the dropdown above and click{" "}
              <strong>Check Latest Status</strong> to fetch the most recent
              execution details.
            </p>
          </div>
        )}

        {/* Loading skeleton */}
        {fetchState === "loading" && <ResultSkeleton />}

        {/* Success (live or mock fallback) */}
        {fetchState === "success" && result && (
          <div className="job-result-wrap">
            {/* Mock data warning banner */}
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

            {/* Raw JSON toggle */}
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
