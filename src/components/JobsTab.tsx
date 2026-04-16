import React, { useState, useEffect, useMemo } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import {
  FiRefreshCw,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiPauseCircle,
  FiPlayCircle,
  FiCalendar,
  FiActivity,
  FiZap,
} from "react-icons/fi";

/* ─── Types ──────────────────────────────────────────────── */
export type JobStatus = "UP" | "DOWN" | "DEGRADED" | "PAUSED" | "RUNNING" | "SCHEDULED";
export type JobEnv = "dev" | "staging" | "prod";

export interface Job {
  id: string;
  name: string;
  description: string;
  status: JobStatus;
  environment: JobEnv;
  schedule: string;
  lastRunAt: string;
  nextRunAt: string;
  lastUpAt: string;
  lastDownAt: string | null;
  lastDownReason: string | null;
  avgDurationMs: number;
  successRate: number;
  totalRuns: number;
  retries: number;
  owner: string;
}

/* ─── Dummy data ─────────────────────────────────────────── */
const DUMMY_JOBS: Job[] = [
  {
    id: "job-001",
    name: "Data Sync Worker",
    description: "Syncs platform data from upstream sources every 5 minutes",
    status: "UP",
    environment: "dev",
    schedule: "*/5 * * * *",
    lastRunAt: "2026-04-16T10:45:00Z",
    nextRunAt: "2026-04-16T10:50:00Z",
    lastUpAt: "2026-04-16T10:45:00Z",
    lastDownAt: null,
    lastDownReason: null,
    avgDurationMs: 3200,
    successRate: 98.7,
    totalRuns: 4320,
    retries: 0,
    owner: "platform-team",
  },
  {
    id: "job-002",
    name: "Cache Invalidation",
    description: "Clears stale cache entries across all nodes",
    status: "DOWN",
    environment: "dev",
    schedule: "0 * * * *",
    lastRunAt: "2026-04-16T09:00:00Z",
    nextRunAt: "2026-04-16T10:00:00Z",
    lastUpAt: "2026-04-16T08:00:00Z",
    lastDownAt: "2026-04-16T09:00:00Z",
    lastDownReason: "Redis connection timeout",
    avgDurationMs: 800,
    successRate: 72.3,
    totalRuns: 720,
    retries: 3,
    owner: "infra-team",
  },
  {
    id: "job-003",
    name: "Report Generator",
    description: "Generates daily analytics reports and pushes to S3",
    status: "SCHEDULED",
    environment: "dev",
    schedule: "0 2 * * *",
    lastRunAt: "2026-04-15T02:00:00Z",
    nextRunAt: "2026-04-16T02:00:00Z",
    lastUpAt: "2026-04-15T02:00:00Z",
    lastDownAt: null,
    lastDownReason: null,
    avgDurationMs: 45000,
    successRate: 100,
    totalRuns: 180,
    retries: 0,
    owner: "analytics-team",
  },
  {
    id: "job-004",
    name: "Notification Dispatcher",
    description: "Dispatches queued push notifications in bulk",
    status: "DEGRADED",
    environment: "dev",
    schedule: "*/2 * * * *",
    lastRunAt: "2026-04-16T10:43:00Z",
    nextRunAt: "2026-04-16T10:45:00Z",
    lastUpAt: "2026-04-16T10:41:00Z",
    lastDownAt: "2026-04-16T10:43:00Z",
    lastDownReason: "High latency > 2s threshold",
    avgDurationMs: 2100,
    successRate: 85.4,
    totalRuns: 10800,
    retries: 2,
    owner: "notifications-team",
  },
  {
    id: "job-005",
    name: "DB Backup",
    description: "Creates incremental snapshots of primary databases",
    status: "PAUSED",
    environment: "dev",
    schedule: "0 3 * * *",
    lastRunAt: "2026-04-14T03:00:00Z",
    nextRunAt: "—",
    lastUpAt: "2026-04-14T03:00:00Z",
    lastDownAt: null,
    lastDownReason: null,
    avgDurationMs: 120000,
    successRate: 99.1,
    totalRuns: 90,
    retries: 0,
    owner: "dba-team",
  },
  {
    id: "job-006",
    name: "Health Probe",
    description: "Pings all registered services and updates health matrix",
    status: "RUNNING",
    environment: "dev",
    schedule: "* * * * *",
    lastRunAt: "2026-04-16T10:46:00Z",
    nextRunAt: "2026-04-16T10:47:00Z",
    lastUpAt: "2026-04-16T10:46:00Z",
    lastDownAt: null,
    lastDownReason: null,
    avgDurationMs: 420,
    successRate: 99.9,
    totalRuns: 50000,
    retries: 0,
    owner: "platform-team",
  },
  {
    id: "job-007",
    name: "Event Aggregator",
    description: "Aggregates raw events into hourly buckets for analytics",
    status: "UP",
    environment: "staging",
    schedule: "0 * * * *",
    lastRunAt: "2026-04-16T10:00:00Z",
    nextRunAt: "2026-04-16T11:00:00Z",
    lastUpAt: "2026-04-16T10:00:00Z",
    lastDownAt: null,
    lastDownReason: null,
    avgDurationMs: 8500,
    successRate: 97.8,
    totalRuns: 2160,
    retries: 1,
    owner: "analytics-team",
  },
  {
    id: "job-008",
    name: "Token Cleanup",
    description: "Removes expired auth tokens from cache and DB",
    status: "DOWN",
    environment: "staging",
    schedule: "*/30 * * * *",
    lastRunAt: "2026-04-16T10:30:00Z",
    nextRunAt: "2026-04-16T11:00:00Z",
    lastUpAt: "2026-04-16T10:00:00Z",
    lastDownAt: "2026-04-16T10:30:00Z",
    lastDownReason: "DB connection refused",
    avgDurationMs: 1200,
    successRate: 68.1,
    totalRuns: 4320,
    retries: 3,
    owner: "auth-team",
  },
  {
    id: "job-009",
    name: "Metrics Pusher",
    description: "Pushes collected metrics to monitoring stack",
    status: "UP",
    environment: "prod",
    schedule: "*/1 * * * *",
    lastRunAt: "2026-04-16T10:46:00Z",
    nextRunAt: "2026-04-16T10:47:00Z",
    lastUpAt: "2026-04-16T10:46:00Z",
    lastDownAt: null,
    lastDownReason: null,
    avgDurationMs: 500,
    successRate: 99.95,
    totalRuns: 100000,
    retries: 0,
    owner: "observability-team",
  },
  {
    id: "job-010",
    name: "Index Rebuilder",
    description: "Rebuilds Elasticsearch indices for search performance",
    status: "DEGRADED",
    environment: "prod",
    schedule: "0 1 * * 0",
    lastRunAt: "2026-04-13T01:00:00Z",
    nextRunAt: "2026-04-20T01:00:00Z",
    lastUpAt: "2026-04-13T01:00:00Z",
    lastDownAt: "2026-04-13T01:35:00Z",
    lastDownReason: "Memory pressure — took 10x longer than avg",
    avgDurationMs: 600000,
    successRate: 83.3,
    totalRuns: 12,
    retries: 1,
    owner: "search-team",
  },
];

/* ─── Fake API call ──────────────────────────────────────── */
type FetchState = "loading" | "success" | "error" | "empty";

function useFetchJobs(env: JobEnv, statusFilter: string, module: string) {
  const [state, setState] = useState<FetchState>("loading");
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    setState("loading");
    setJobs([]);

    const timer = setTimeout(() => {
      // Simulate occasional API failure
      if (Math.random() < 0.05) {
        setState("error");
        return;
      }

      const filtered = DUMMY_JOBS.filter(
        (j) =>
          j.environment === env &&
          (statusFilter === "ALL" || j.status === statusFilter)
      );

      if (filtered.length === 0) {
        setState("empty");
      } else {
        setJobs(filtered);
        setState("success");
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [env, statusFilter, module]);

  return { state, jobs, refetch: () => setState("loading") };
}

/* ─── Helpers ────────────────────────────────────────────── */
const STATUS_CONFIG: Record<
  JobStatus,
  { label: string; color: string; bg: string; border: string; Icon: React.ElementType }
> = {
  UP: {
    label: "UP",
    color: "#16a34a",
    bg: "#f0fdf4",
    border: "#16a34a",
    Icon: FiCheckCircle,
  },
  DOWN: {
    label: "DOWN",
    color: "#dc2626",
    bg: "#fff5f5",
    border: "#dc2626",
    Icon: FiXCircle,
  },
  DEGRADED: {
    label: "DEGRADED",
    color: "#d97706",
    bg: "#fffbeb",
    border: "#d97706",
    Icon: FiAlertTriangle,
  },
  PAUSED: {
    label: "PAUSED",
    color: "#64748b",
    bg: "#f8fafc",
    border: "#94a3b8",
    Icon: FiPauseCircle,
  },
  RUNNING: {
    label: "RUNNING",
    color: "#3b82f6",
    bg: "#eff6ff",
    border: "#3b82f6",
    Icon: FiPlayCircle,
  },
  SCHEDULED: {
    label: "SCHEDULED",
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#7c3aed",
    Icon: FiCalendar,
  },
};

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  if (ms < 3600000) return `${(ms / 60000).toFixed(1)}m`;
  return `${(ms / 3600000).toFixed(1)}h`;
}

function formatRelative(iso: string | null): string {
  if (!iso || iso === "—") return "—";
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

/* ─── Skeleton ───────────────────────────────────────────── */
const JobCardSkeleton: React.FC = () => (
  <div className="job-card job-card-skeleton">
    <div className="skeleton-line skeleton-title" />
    <div className="skeleton-line skeleton-sub" />
    <div className="job-card-meta-row">
      <div className="skeleton-line skeleton-badge" />
      <div className="skeleton-line skeleton-badge" />
    </div>
    <div className="job-card-stats">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="job-stat">
          <div className="skeleton-line skeleton-stat-label" />
          <div className="skeleton-line skeleton-stat-val" />
        </div>
      ))}
    </div>
  </div>
);

/* ─── Job Card ───────────────────────────────────────────── */
const JobCard: React.FC<{ job: Job }> = ({ job }) => {
  const cfg = STATUS_CONFIG[job.status];
  const { Icon } = cfg;

  return (
    <div
      className="job-card"
      style={{
        borderTopColor: cfg.border,
        background: `linear-gradient(160deg, #ffffff 0%, ${cfg.bg} 100%)`,
      }}
    >
      {/* Header */}
      <div className="job-card-header">
        <div className="job-card-title-wrap">
          <span className="job-card-name">{job.name}</span>
          <span
            className="job-status-badge"
            style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}
          >
            <Icon size={11} />
            {cfg.label}
          </span>
        </div>
        <p className="job-card-desc">{job.description}</p>
      </div>

      {/* Meta row */}
      <div className="job-card-meta-row">
        <span className="job-meta-tag">
          <FiZap size={10} />
          {job.schedule}
        </span>
        <span className="job-meta-tag job-meta-owner">
          <FiActivity size={10} />
          {job.owner}
        </span>
      </div>

      {/* Stats */}
      <div className="job-card-stats">
        <div className="job-stat">
          <span className="job-stat-label">
            <FiClock size={11} /> Last Run
          </span>
          <span className="job-stat-val">{formatRelative(job.lastRunAt)}</span>
        </div>
        <div className="job-stat">
          <span className="job-stat-label">
            <FiCheckCircle size={11} /> Last Up
          </span>
          <span className="job-stat-val text-up">{formatRelative(job.lastUpAt)}</span>
        </div>
        <div className="job-stat">
          <span className="job-stat-label">
            <FiXCircle size={11} /> Last Down
          </span>
          <span
            className="job-stat-val"
            style={{ color: job.lastDownAt ? "#dc2626" : "#64748b" }}
          >
            {job.lastDownAt ? formatRelative(job.lastDownAt) : "Never"}
          </span>
        </div>
        <div className="job-stat">
          <span className="job-stat-label">
            <FiCalendar size={11} /> Next Run
          </span>
          <span className="job-stat-val">{formatRelative(job.nextRunAt)}</span>
        </div>
        <div className="job-stat">
          <span className="job-stat-label">Avg Duration</span>
          <span className="job-stat-val">{formatDuration(job.avgDurationMs)}</span>
        </div>
        <div className="job-stat">
          <span className="job-stat-label">Success Rate</span>
          <span
            className="job-stat-val"
            style={{
              color:
                job.successRate >= 95
                  ? "#16a34a"
                  : job.successRate >= 80
                  ? "#d97706"
                  : "#dc2626",
            }}
          >
            {job.successRate.toFixed(1)}%
          </span>
        </div>
        <div className="job-stat">
          <span className="job-stat-label">Total Runs</span>
          <span className="job-stat-val">{job.totalRuns.toLocaleString()}</span>
        </div>
        <div className="job-stat">
          <span className="job-stat-label">Retries</span>
          <span
            className="job-stat-val"
            style={{ color: job.retries > 0 ? "#d97706" : "#64748b" }}
          >
            {job.retries}
          </span>
        </div>
      </div>

      {/* Down reason */}
      {job.lastDownReason && (
        <div className="job-down-reason">
          <FiAlertTriangle size={11} />
          {job.lastDownReason}
        </div>
      )}
    </div>
  );
};

/* ─── Pie Chart ──────────────────────────────────────────── */
const JobsPieChart: React.FC<{ jobs: Job[] }> = ({ jobs }) => {
  const byStatus = useMemo(() => {
    const counts: Partial<Record<JobStatus, number>> = {};
    for (const j of jobs) {
      counts[j.status] = (counts[j.status] ?? 0) + 1;
    }
    return Object.entries(counts).map(([status, value]) => ({
      name: status as JobStatus,
      value: value as number,
      fill: STATUS_CONFIG[status as JobStatus].color,
    }));
  }, [jobs]);

  const byEnv = useMemo(() => {
    const envColors: Record<JobEnv, string> = {
      dev: "#3b82f6",
      staging: "#f59e0b",
      prod: "#10b981",
    };
    const counts: Partial<Record<JobEnv, number>> = {};
    for (const j of jobs) {
      counts[j.environment] = (counts[j.environment] ?? 0) + 1;
    }
    return Object.entries(counts).map(([env, value]) => ({
      name: env as JobEnv,
      value: value as number,
      fill: envColors[env as JobEnv],
    }));
  }, [jobs]);

  return (
    <div className="jobs-charts-row">
      {/* Status distribution */}
      <div className="jobs-chart-card">
        <h4 className="jobs-chart-title">
          <FiActivity size={14} />
          Status Distribution
        </h4>
        <ResponsiveContainer width="100%" height={170}>
          <PieChart>
            <Pie
              data={byStatus}
              cx="50%"
              cy="50%"
              innerRadius={42}
              outerRadius={68}
              dataKey="value"
              strokeWidth={2}
              stroke="#fff"
            >
              {byStatus.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [value, name]}
              contentStyle={{ borderRadius: 8, fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="jobs-chart-legend">
          {byStatus.map((d, i) => (
            <div key={i} className="dep-legend-item">
              <span className="dep-legend-dot" style={{ background: d.fill }} />
              <span className="dep-legend-name">{d.name}</span>
              <span className="dep-legend-count">{d.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Env distribution */}
      <div className="jobs-chart-card">
        <h4 className="jobs-chart-title">
          <FiZap size={14} />
          Environment Split
        </h4>
        <ResponsiveContainer width="100%" height={170}>
          <PieChart>
            <Pie
              data={byEnv}
              cx="50%"
              cy="50%"
              innerRadius={42}
              outerRadius={68}
              dataKey="value"
              strokeWidth={2}
              stroke="#fff"
            >
              {byEnv.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [value, name]}
              contentStyle={{ borderRadius: 8, fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="jobs-chart-legend">
          {byEnv.map((d, i) => (
            <div key={i} className="dep-legend-item">
              <span className="dep-legend-dot" style={{ background: d.fill }} />
              <span className="dep-legend-name">{d.name}</span>
              <span className="dep-legend-count">{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────────── */
interface JobsTabProps {
  selectedModule: string;
}

export const JobsTab: React.FC<JobsTabProps> = ({ selectedModule }) => {
  const [env, setEnv] = useState<JobEnv>("dev");
  const [statusFilter, setStatusFilter] = useState<string>("UP");
  const { state, jobs, refetch } = useFetchJobs(env, statusFilter, selectedModule);

  const allJobsForCharts = useMemo(
    () => DUMMY_JOBS.filter((j) => j.environment === env),
    [env]
  );

  return (
    <div className="jobs-tab-root">
      {/* ── Controls bar ── */}
      <div className="jobs-controls-bar">
        <div className="jobs-controls-left">
          <div className="jobs-select-wrap">
            <label className="jobs-select-label">Environment</label>
            <select
              className="jobs-select"
              value={env}
              onChange={(e) => setEnv(e.target.value as JobEnv)}
            >
              <option value="dev">Dev</option>
              <option value="staging">Staging</option>
              <option value="prod">Prod</option>
            </select>
          </div>

          <div className="jobs-select-wrap">
            <label className="jobs-select-label">Status</label>
            <select
              className="jobs-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All</option>
              <option value="UP">UP</option>
              <option value="DOWN">DOWN</option>
              <option value="DEGRADED">DEGRADED</option>
              <option value="PAUSED">PAUSED</option>
              <option value="RUNNING">RUNNING</option>
              <option value="SCHEDULED">SCHEDULED</option>
            </select>
          </div>
        </div>

        <div className="jobs-controls-right">
          {state === "success" && (
            <span className="jobs-count-badge">
              {jobs.length} job{jobs.length !== 1 ? "s" : ""}
            </span>
          )}
          <button
            className="jobs-refresh-btn"
            onClick={refetch}
            disabled={state === "loading"}
            title="Refresh"
          >
            <FiRefreshCw
              size={14}
              style={{
                animation: state === "loading" ? "spin 1s linear infinite" : "none",
              }}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Scrollable body: charts + cards / fallback states ── */}
      <div className="jobs-scroll-body">
        {/* Charts (always shown when data is available) */}
        {state === "success" && allJobsForCharts.length > 0 && (
          <JobsPieChart jobs={allJobsForCharts} />
        )}

        {/* Loading skeletons */}
        {state === "loading" && (
          <div className="jobs-grid">
            {[1, 2, 3, 4].map((i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Job cards */}
        {state === "success" && (
          <div className="jobs-grid">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {state === "empty" && (
          <div className="jobs-fallback">
            <FiRefreshCw size={38} className="jobs-fallback-icon" />
            <h3>No jobs found</h3>
            <p>
              No <strong>{statusFilter === "ALL" ? "" : statusFilter}</strong> jobs in{" "}
              <strong>{env}</strong> for <strong>{selectedModule}</strong>.
            </p>
            <button className="jobs-refresh-btn" onClick={refetch}>
              <FiRefreshCw size={13} /> Retry
            </button>
          </div>
        )}

        {/* Error state */}
        {state === "error" && (
          <div className="jobs-fallback jobs-fallback-error">
            <FiXCircle size={38} className="jobs-fallback-icon-error" />
            <h3>Failed to load jobs</h3>
            <p>Something went wrong while fetching jobs. Please try again.</p>
            <button className="jobs-refresh-btn jobs-refresh-btn-danger" onClick={refetch}>
              <FiRefreshCw size={13} /> Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
