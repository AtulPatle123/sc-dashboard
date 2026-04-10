import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Area,
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

type MetricKey = 'traffic' | 'newUsers' | 'sales' | 'conversion';
type DetailNavKey = 'healthCheckup' | 'monitoring' | 'traffic' | 'xyz';
type AppScreen = 'home' | 'details';
type NotificationSeverity = 'ok' | 'warn' | 'down';
type ChartKind = 'area' | 'bar' | 'line';

type Point = {
  month: string;
  value: number;
};

type ChartPoint = Point & {
  bestFit: number;
};

type DashboardMetric = {
  key: MetricKey;
  label: string;
  valueLabel: string;
  growth: string;
  positive: boolean;
  color: string;
  secondaryColor: string;
  chartKind: ChartKind;
  chart: Point[];
};

type DetailCard = {
  id: string;
  title: string;
  subtitle: string;
  metricKey: MetricKey;
};

type AlertNotification = {
  id: string;
  title: string;
  message: string;
  severity: NotificationSeverity;
  timestamp: string;
};

const fetchDashboardData = async (): Promise<DashboardMetric[]> => {
  await new Promise((resolve) => setTimeout(resolve, 400));

  return [
    {
      key: 'traffic',
      label: 'Traffic',
      valueLabel: '350,897',
      growth: '+6.9%',
      positive: true,
      color: '#4C6FAE',
      secondaryColor: '#7FA7D8',
      chartKind: 'area',
      chart: [
        { month: 'May', value: 120 },
        { month: 'Jun', value: 148 },
        { month: 'Jul', value: 132 },
        { month: 'Aug', value: 176 },
        { month: 'Sep', value: 162 },
        { month: 'Oct', value: 210 },
        { month: 'Nov', value: 198 },
        { month: 'Dec', value: 244 }
      ]
    },
    {
      key: 'newUsers',
      label: 'New Users',
      valueLabel: '2,356',
      growth: '+2.1%',
      positive: true,
      color: '#5E7FB1',
      secondaryColor: '#8FB0D6',
      chartKind: 'bar',
      chart: [
        { month: 'May', value: 380 },
        { month: 'Jun', value: 364 },
        { month: 'Jul', value: 352 },
        { month: 'Aug', value: 402 },
        { month: 'Sep', value: 388 },
        { month: 'Oct', value: 436 },
        { month: 'Nov', value: 418 },
        { month: 'Dec', value: 450 }
      ]
    },
    {
      key: 'sales',
      label: 'Sales',
      valueLabel: '924',
      growth: '+11.0%',
      positive: true,
      color: '#4D86A4',
      secondaryColor: '#7DB9C4',
      chartKind: 'line',
      chart: [
        { month: 'May', value: 58 },
        { month: 'Jun', value: 72 },
        { month: 'Jul', value: 69 },
        { month: 'Aug', value: 98 },
        { month: 'Sep', value: 90 },
        { month: 'Oct', value: 118 },
        { month: 'Nov', value: 111 },
        { month: 'Dec', value: 132 }
      ]
    },
    {
      key: 'conversion',
      label: 'Conversion',
      valueLabel: '49.65%',
      growth: '-1.4%',
      positive: false,
      color: '#A6736A',
      secondaryColor: '#C89A92',
      chartKind: 'line',
      chart: [
        { month: 'May', value: 44 },
        { month: 'Jun', value: 46 },
        { month: 'Jul', value: 47 },
        { month: 'Aug', value: 52 },
        { month: 'Sep', value: 51 },
        { month: 'Oct', value: 56 },
        { month: 'Nov', value: 53 },
        { month: 'Dec', value: 50 }
      ]
    }
  ];
};

const detailCardsByNav: Record<DetailNavKey, DetailCard[]> = {
  healthCheckup: [
    { id: 'hc-1', title: 'Vitals Stability', subtitle: 'Track baseline health trends', metricKey: 'traffic' },
    { id: 'hc-2', title: 'Recovery Index', subtitle: 'Follow improvement trajectory', metricKey: 'conversion' }
  ],
  monitoring: [
    { id: 'mn-1', title: 'Live Monitoring', subtitle: 'Real-time usage and alerts', metricKey: 'newUsers' },
    { id: 'mn-2', title: 'Watchlist Status', subtitle: 'Observe systems in focus', metricKey: 'sales' }
  ],
  traffic: [
    { id: 'tf-1', title: 'Inbound Flow', subtitle: 'Source and session patterns', metricKey: 'traffic' },
    { id: 'tf-2', title: 'Channel Split', subtitle: 'Compare segment performance', metricKey: 'sales' }
  ],
  xyz: [
    { id: 'xy-1', title: 'XYZ Momentum', subtitle: 'Dummy KPI performance pulse', metricKey: 'conversion' },
    { id: 'xy-2', title: 'XYZ Reliability', subtitle: 'Operational confidence score', metricKey: 'newUsers' }
  ]
};

const detailNavItems: Array<{ key: DetailNavKey; label: string }> = [
  { key: 'healthCheckup', label: 'Health Checkup' },
  { key: 'monitoring', label: 'Monitoring' },
  { key: 'traffic', label: 'Traffic' },
  { key: 'xyz', label: 'XYZ' }
];

const notifications: AlertNotification[] = [
  {
    id: 'n1',
    title: 'Payments API down',
    message: 'Checkout service is unreachable in us-east-1.',
    severity: 'down',
    timestamp: '2 min ago'
  },
  {
    id: 'n2',
    title: 'CPU usage high',
    message: 'Worker node #4 crossed 85% for the last 10 minutes.',
    severity: 'warn',
    timestamp: '8 min ago'
  },
  {
    id: 'n3',
    title: 'Backup completed',
    message: 'Nightly backup finished successfully.',
    severity: 'ok',
    timestamp: '17 min ago'
  }
];

const getNextMetric = (data: DashboardMetric[], activeMetric: MetricKey, direction: 'next' | 'prev'): MetricKey => {
  const currentIndex = data.findIndex((item) => item.key === activeMetric);
  if (currentIndex === -1) return data[0].key;

  const delta = direction === 'next' ? 1 : -1;
  const nextIndex = (currentIndex + delta + data.length) % data.length;
  return data[nextIndex].key;
};

const withBestFit = (points: Point[]): ChartPoint[] => {
  if (!points.length) return [];

  const n = points.length;
  const xMean = (n - 1) / 2;
  const yMean = points.reduce((sum, point) => sum + point.value, 0) / n;

  let numerator = 0;
  let denominator = 0;

  points.forEach((point, index) => {
    numerator += (index - xMean) * (point.value - yMean);
    denominator += (index - xMean) ** 2;
  });

  const slope = denominator === 0 ? 0 : numerator / denominator;
  const intercept = yMean - slope * xMean;

  return points.map((point, index) => ({
    ...point,
    bestFit: Number((intercept + slope * index).toFixed(2))
  }));
};

const notificationIconBySeverity: Record<NotificationSeverity, string> = {
  down: '⛔',
  warn: '⚠️',
  ok: '✅'
};

const buildCompositionData = (selected: DashboardMetric | undefined, latestPoint: ChartPoint | undefined) => {
  if (!selected || !latestPoint) return [];

  const total = Math.max(latestPoint.value, 1);
  const healthy = Math.round(total * (selected.positive ? 0.64 : 0.5));
  const warning = Math.round(total * 0.23);
  const critical = Math.max(total - healthy - warning, 0);

  return [
    { name: 'Healthy', value: healthy, color: selected.color },
    { name: 'Warning', value: warning, color: selected.secondaryColor },
    { name: 'Critical', value: critical, color: '#C38A88' }
  ];
};

export const App = () => {
  const { data = [], isLoading } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: fetchDashboardData
  });

  const [screen, setScreen] = useState<AppScreen>('home');
  const [activeMetric, setActiveMetric] = useState<MetricKey>('traffic');
  const [isGraphHovered, setIsGraphHovered] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [activeDetailNav, setActiveDetailNav] = useState<DetailNavKey>('healthCheckup');
  const [activeDetailCard, setActiveDetailCard] = useState<string>(detailCardsByNav.healthCheckup[0].id);

  const selected = useMemo(
    () => data.find((item) => item.key === activeMetric) ?? data[0],
    [activeMetric, data]
  );
  const selectedChart = useMemo(() => withBestFit(selected?.chart ?? []), [selected]);
  const latestPoint = selectedChart[selectedChart.length - 1];
  const previousPoint = selectedChart[selectedChart.length - 2];
  const delta = latestPoint && previousPoint ? latestPoint.value - previousPoint.value : 0;
  const deltaDirection = delta >= 0 ? 'up' : 'down';

  const activeDetailCards = detailCardsByNav[activeDetailNav];
  const unreadAlerts = notifications.filter((item) => item.severity !== 'ok').length;
  const compositionData = useMemo(() => buildCompositionData(selected, latestPoint), [latestPoint, selected]);

  useEffect(() => {
    if (!data.length || isGraphHovered || screen !== 'home') return;

    const interval = window.setInterval(() => {
      setActiveMetric((current) => getNextMetric(data, current, 'next'));
    }, 5000);

    return () => window.clearInterval(interval);
  }, [data, isGraphHovered, screen]);

  useEffect(() => {
    setActiveDetailCard(activeDetailCards[0].id);
    setActiveMetric(activeDetailCards[0].metricKey);
  }, [activeDetailCards]);

  const handleManualSlide = (direction: 'next' | 'prev') => {
    if (!data.length) return;
    setActiveMetric((current) => getNextMetric(data, current, direction));
  };

  const openDetailsScreen = (metric: MetricKey) => {
    setActiveMetric(metric);
    setScreen('details');
  };

  const chartStyles = {
    '--accent': selected?.color,
    '--accent-2': selected?.secondaryColor
  } as CSSProperties;

  return (
    <main className="app-shell" style={chartStyles}>
      <header className="top-bar">
        <div>
          <p className="overview-label">Calm Operations Dashboard</p>
          <h1>Service Health Center</h1>
        </div>

        <button className="notification-button" onClick={() => setShowNotifications((current) => !current)}>
          <span className="notification-icon" aria-hidden>
            🔔
          </span>
          <span>Notifications</span>
          {unreadAlerts > 0 && <span className="notification-badge">{unreadAlerts}</span>}
        </button>
      </header>

      <AnimatePresence>
        {showNotifications && (
          <motion.section
            className="notification-panel"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {notifications.map((item, index) => (
              <motion.article
                key={item.id}
                className={`notification-item ${item.severity}`}
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="notification-row">
                  <h3>
                    <span className="severity-icon">{notificationIconBySeverity[item.severity]}</span>
                    {item.title}
                  </h3>
                  <span>{item.timestamp}</span>
                </div>
                <p>{item.message}</p>
              </motion.article>
            ))}
          </motion.section>
        )}
      </AnimatePresence>

      {screen === 'home' ? (
        <>
          <section className="metrics-grid">
            {data.map((metric) => (
              <button
                key={metric.key}
                className={`metric-card ${metric.key === selected?.key ? 'active' : ''}`}
                onClick={() => openDetailsScreen(metric.key)}
                style={{ '--accent': metric.color, '--accent-2': metric.secondaryColor } as CSSProperties}
              >
                <p className="metric-title">{metric.label}</p>
                <p className="metric-value">{metric.valueLabel}</p>
                <p className={`metric-growth ${metric.positive ? 'positive' : 'negative'}`}>
                  {metric.growth} since last month
                </p>
              </button>
            ))}
          </section>

          <section className="home-layout">
            <section
              className="overview-card"
              onMouseEnter={() => setIsGraphHovered(true)}
              onMouseLeave={() => setIsGraphHovered(false)}
            >
              <div className="overview-header">
                <div>
                  <p className="overview-label">Overview</p>
                  <h2>{selected?.label} trend</h2>
                  <p className="overview-subtitle">Chart type auto-adjusts to metric context for cleaner data representation.</p>
                </div>

                <div className="carousel-controls">
                  <button className="carousel-arrow" onClick={() => handleManualSlide('prev')} aria-label="Previous graph">
                    ‹
                  </button>
                  <button className="carousel-arrow" onClick={() => handleManualSlide('next')} aria-label="Next graph">
                    ›
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div className="loading">Loading chart data…</div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selected?.key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="chart-wrap"
                  >
                    <ResponsiveContainer width="100%" height={360}>
                      <ComposedChart data={selectedChart}>
                        <defs>
                          <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor={selected?.color} stopOpacity={0.95} />
                            <stop offset="100%" stopColor={selected?.secondaryColor} stopOpacity={0.95} />
                          </linearGradient>
                          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={selected?.color} stopOpacity={0.45} />
                            <stop offset="100%" stopColor={selected?.secondaryColor} stopOpacity={0.05} />
                          </linearGradient>
                        </defs>

                        <CartesianGrid stroke="rgba(91, 112, 136, 0.2)" vertical={false} />
                        <XAxis dataKey="month" tick={{ fill: '#5f7289', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#5f7289', fontSize: 12 }} axisLine={false} tickLine={false} />

                        <Tooltip
                          contentStyle={{
                            borderRadius: 12,
                            border: '1px solid rgba(135, 157, 182, 0.45)',
                            backgroundColor: '#ffffff',
                            color: '#1f294f'
                          }}
                        />

                        {selected?.chartKind !== 'line' && (
                          <Area type="monotone" dataKey="value" fill="url(#areaGradient)" strokeOpacity={0} />
                        )}

                        {selected?.chartKind === 'bar' && (
                          <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="url(#lineGradient)" barSize={26} />
                        )}

                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="url(#lineGradient)"
                          strokeWidth={selected?.chartKind === 'line' ? 4 : 3}
                          dot={{ r: 4, strokeWidth: 0, fill: selected?.color }}
                          activeDot={{ r: 7 }}
                          animationDuration={650}
                        />
                        <Line
                          type="monotone"
                          dataKey="bestFit"
                          stroke="#6D9F8E"
                          strokeWidth={2}
                          strokeDasharray="6 6"
                          dot={false}
                          animationDuration={650}
                        />
                        {latestPoint && (
                          <ReferenceDot
                            x={latestPoint.month}
                            y={latestPoint.value}
                            r={7}
                            fill={selected?.secondaryColor}
                            stroke="#ffffff"
                            strokeWidth={2}
                          />
                        )}
                      </ComposedChart>
                    </ResponsiveContainer>
                  </motion.div>
                </AnimatePresence>
              )}
            </section>

            <aside className="side-insights">
              <h3>Quick Summary</h3>
              <p className="overview-subtitle">Using this space for a friendlier summary of what needs attention now.</p>
              <ul>
                <li>1 service is currently down and needs urgent action.</li>
                <li>1 service has warning-level load.</li>
                <li>All backups are healthy and completed.</li>
                {latestPoint && (
                  <li>
                    {selected?.label} is {deltaDirection === 'up' ? 'up' : 'down'} by {Math.abs(delta).toFixed(1)} in the latest cycle.
                  </li>
                )}
              </ul>
            </aside>
          </section>
        </>
      ) : (
        <section className="details-page">
          <button className="back-button" onClick={() => setScreen('home')}>
            <span aria-hidden>←</span>
            Back to Dashboard
          </button>

          <div className="details-layout">
            <aside className="details-sidebar">
              {detailNavItems.map((item) => (
                <button
                  key={item.key}
                  className={`sidebar-item ${activeDetailNav === item.key ? 'active' : ''}`}
                  onClick={() => setActiveDetailNav(item.key)}
                >
                  {item.label}
                </button>
              ))}
            </aside>

            <div className="details-content">
              <div className="details-cards-grid">
                {activeDetailCards.map((card) => (
                  <button
                    key={card.id}
                    className={`details-card ${activeDetailCard === card.id ? 'active' : ''}`}
                    onClick={() => {
                      setActiveDetailCard(card.id);
                      setActiveMetric(card.metricKey);
                    }}
                  >
                    <h3>{card.title}</h3>
                    <p>{card.subtitle}</p>
                  </button>
                ))}
              </div>

              <section className="details-kpi-strip">
                <article className="kpi-pill">
                  <p>Current</p>
                  <strong>{latestPoint?.value ?? '--'}</strong>
                </article>
                <article className="kpi-pill">
                  <p>Best-fit</p>
                  <strong>{latestPoint?.bestFit ?? '--'}</strong>
                </article>
                <article className="kpi-pill">
                  <p>Trend</p>
                  <strong className={delta >= 0 ? 'kpi-up' : 'kpi-down'}>
                    {delta >= 0 ? '▲' : '▼'} {Math.abs(delta).toFixed(1)}
                  </strong>
                </article>
              </section>

              <section className="details-split-layout">
                <section className="overview-card details-graph">
                  <div className="overview-header">
                    <div>
                      <p className="overview-label">{detailNavItems.find((item) => item.key === activeDetailNav)?.label}</p>
                      <h2>{selected?.label} insights</h2>
                      <p className="overview-subtitle">Mixed chart keeps trend + distribution visible together.</p>
                    </div>
                  </div>

                  {isLoading ? (
                    <div className="loading">Loading chart data…</div>
                  ) : (
                    <div className="chart-wrap">
                      <ResponsiveContainer width="100%" height={290}>
                        <ComposedChart data={selectedChart}>
                          <CartesianGrid stroke="rgba(91, 112, 136, 0.2)" vertical={false} />
                          <XAxis dataKey="month" tick={{ fill: '#5f7289', fontSize: 12 }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fill: '#5f7289', fontSize: 12 }} axisLine={false} tickLine={false} />
                          <Tooltip
                            contentStyle={{
                              borderRadius: 12,
                              border: '1px solid rgba(135, 157, 182, 0.45)',
                              backgroundColor: '#ffffff',
                              color: '#1f294f'
                            }}
                          />
                          {selected?.chartKind === 'bar' && (
                            <Bar dataKey="value" fill={selected.secondaryColor} radius={[6, 6, 0, 0]} barSize={20} />
                          )}
                          {selected?.chartKind !== 'bar' && (
                            <Area type="monotone" dataKey="value" fill={selected?.color} fillOpacity={0.18} stroke={selected?.color} strokeWidth={3} />
                          )}
                          <Line type="monotone" dataKey="bestFit" stroke="#6D9F8E" strokeWidth={2} strokeDasharray="6 6" dot={false} />
                          {latestPoint && (
                            <ReferenceDot
                              x={latestPoint.month}
                              y={latestPoint.value}
                              r={7}
                              fill={selected?.secondaryColor}
                              stroke="#ffffff"
                              strokeWidth={2}
                            />
                          )}
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </section>

                <section className="overview-card composition-card">
                  <h3>Current Distribution</h3>
                  <p className="overview-subtitle">Auto-selected donut view for share-based comparison.</p>
                  <div className="composition-wrap">
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie data={compositionData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={4}>
                          {compositionData.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            borderRadius: 12,
                            border: '1px solid rgba(135, 157, 182, 0.45)',
                            backgroundColor: '#ffffff',
                            color: '#1f294f'
                          }}
                        />
                        <Legend verticalAlign="bottom" height={30} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </section>
              </section>
            </div>
          </div>
        </section>
      )}
    </main>
  );
};
