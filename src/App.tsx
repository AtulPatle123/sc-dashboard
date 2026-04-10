import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

type MetricKey = 'traffic' | 'newUsers' | 'sales' | 'conversion';
type DetailNavKey = 'healthCheckup' | 'monitoring' | 'traffic' | 'xyz';
type AppScreen = 'home' | 'details';

type Point = {
  month: string;
  value: number;
};

type DashboardMetric = {
  key: MetricKey;
  label: string;
  valueLabel: string;
  growth: string;
  positive: boolean;
  color: string;
  chart: Point[];
};

type DetailCard = {
  id: string;
  title: string;
  subtitle: string;
  metricKey: MetricKey;
};

const fetchDashboardData = async (): Promise<DashboardMetric[]> => {
  await new Promise((resolve) => setTimeout(resolve, 400));

  return [
    {
      key: 'traffic',
      label: 'Traffic',
      valueLabel: '350,897',
      growth: '+3.48%',
      positive: true,
      color: '#3b82f6',
      chart: [
        { month: 'May', value: 8 },
        { month: 'Jun', value: 20 },
        { month: 'Jul', value: 12 },
        { month: 'Aug', value: 30 },
        { month: 'Sep', value: 16 },
        { month: 'Oct', value: 40 },
        { month: 'Nov', value: 22 },
        { month: 'Dec', value: 58 }
      ]
    },
    {
      key: 'newUsers',
      label: 'New Users',
      valueLabel: '2,356',
      growth: '-3.48%',
      positive: false,
      color: '#8b5cf6',
      chart: [
        { month: 'May', value: 30 },
        { month: 'Jun', value: 26 },
        { month: 'Jul', value: 24 },
        { month: 'Aug', value: 36 },
        { month: 'Sep', value: 34 },
        { month: 'Oct', value: 41 },
        { month: 'Nov', value: 37 },
        { month: 'Dec', value: 52 }
      ]
    },
    {
      key: 'sales',
      label: 'Sales',
      valueLabel: '924',
      growth: '+11.0%',
      positive: true,
      color: '#06b6d4',
      chart: [
        { month: 'May', value: 6 },
        { month: 'Jun', value: 14 },
        { month: 'Jul', value: 11 },
        { month: 'Aug', value: 22 },
        { month: 'Sep', value: 19 },
        { month: 'Oct', value: 35 },
        { month: 'Nov', value: 27 },
        { month: 'Dec', value: 49 }
      ]
    },
    {
      key: 'conversion',
      label: 'Conversion',
      valueLabel: '49.65%',
      growth: '+12%',
      positive: true,
      color: '#f59e0b',
      chart: [
        { month: 'May', value: 12 },
        { month: 'Jun', value: 16 },
        { month: 'Jul', value: 19 },
        { month: 'Aug', value: 23 },
        { month: 'Sep', value: 22 },
        { month: 'Oct', value: 30 },
        { month: 'Nov', value: 33 },
        { month: 'Dec', value: 44 }
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

const getNextMetric = (data: DashboardMetric[], activeMetric: MetricKey, direction: 'next' | 'prev'): MetricKey => {
  const currentIndex = data.findIndex((item) => item.key === activeMetric);
  if (currentIndex === -1) return data[0].key;

  const delta = direction === 'next' ? 1 : -1;
  const nextIndex = (currentIndex + delta + data.length) % data.length;
  return data[nextIndex].key;
};

export const App = () => {
  const { data = [], isLoading } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: fetchDashboardData
  });

  const [screen, setScreen] = useState<AppScreen>('home');
  const [activeMetric, setActiveMetric] = useState<MetricKey>('traffic');
  const [isGraphHovered, setIsGraphHovered] = useState(false);

  const [activeDetailNav, setActiveDetailNav] = useState<DetailNavKey>('healthCheckup');
  const [activeDetailCard, setActiveDetailCard] = useState<string>(detailCardsByNav.healthCheckup[0].id);

  const selected = useMemo(
    () => data.find((item) => item.key === activeMetric) ?? data[0],
    [activeMetric, data]
  );

  const activeDetailCards = detailCardsByNav[activeDetailNav];

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

  return (
    <main className="app-shell">
      {screen === 'home' ? (
        <>
          <section className="metrics-grid">
            {data.map((metric) => (
              <button
                key={metric.key}
                className={`metric-card ${metric.key === selected?.key ? 'active' : ''}`}
                onClick={() => openDetailsScreen(metric.key)}
                style={{ '--accent': metric.color } as React.CSSProperties}
              >
                <p className="metric-title">{metric.label}</p>
                <p className="metric-value">{metric.valueLabel}</p>
                <p className={`metric-growth ${metric.positive ? 'positive' : 'negative'}`}>
                  {metric.growth} since last month
                </p>
              </button>
            ))}
          </section>

          <section
            className="overview-card"
            onMouseEnter={() => setIsGraphHovered(true)}
            onMouseLeave={() => setIsGraphHovered(false)}
          >
            <div className="overview-header">
              <div>
                <p className="overview-label">Overview</p>
                <h2>{selected?.label} trend</h2>
                <p className="overview-subtitle">Auto-switches every 5s when not hovered.</p>
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
                    <AreaChart data={selected?.chart}>
                      <defs>
                        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor={selected?.color} stopOpacity={0.7} />
                          <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.9} />
                        </linearGradient>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={selected?.color} stopOpacity={0.35} />
                          <stop offset="100%" stopColor={selected?.color} stopOpacity={0.02} />
                        </linearGradient>
                      </defs>

                      <CartesianGrid stroke="rgba(148, 163, 184, 0.15)" vertical={false} />
                      <XAxis dataKey="month" tick={{ fill: '#cbd5e1', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#cbd5e1', fontSize: 12 }} axisLine={false} tickLine={false} />

                      <Tooltip
                        contentStyle={{
                          borderRadius: 12,
                          border: '1px solid rgba(125, 211, 252, 0.35)',
                          backgroundColor: 'rgba(15, 23, 42, 0.92)',
                          color: '#f8fafc'
                        }}
                      />

                      <Area type="monotone" dataKey="value" fill="url(#areaGradient)" strokeOpacity={0} />

                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="url(#lineGradient)"
                        strokeWidth={4}
                        dot={{ r: 4, strokeWidth: 0, fill: selected?.color }}
                        activeDot={{ r: 6 }}
                        animationDuration={650}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>
              </AnimatePresence>
            )}
          </section>
        </>
      ) : (
        <section className="details-page">
          <button className="back-button" onClick={() => setScreen('home')}>
            ← Back to Home
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

              <section className="overview-card details-graph">
                <div className="overview-header">
                  <div>
                    <p className="overview-label">{detailNavItems.find((item) => item.key === activeDetailNav)?.label}</p>
                    <h2>{selected?.label} insights</h2>
                    <p className="overview-subtitle">Click sidebar or cards to load different graphs.</p>
                  </div>
                </div>

                {isLoading ? (
                  <div className="loading">Loading chart data…</div>
                ) : (
                  <div className="chart-wrap">
                    <ResponsiveContainer width="100%" height={320}>
                      <AreaChart data={selected?.chart}>
                        <CartesianGrid stroke="rgba(148, 163, 184, 0.15)" vertical={false} />
                        <XAxis dataKey="month" tick={{ fill: '#cbd5e1', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#cbd5e1', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <Tooltip
                          contentStyle={{
                            borderRadius: 12,
                            border: '1px solid rgba(125, 211, 252, 0.35)',
                            backgroundColor: 'rgba(15, 23, 42, 0.92)',
                            color: '#f8fafc'
                          }}
                        />
                        <Area type="monotone" dataKey="value" fill={selected?.color} fillOpacity={0.15} stroke={selected?.color} strokeWidth={3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </section>
            </div>
          </div>
        </section>
      )}
    </main>
  );
};
