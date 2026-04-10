import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart
} from 'recharts';

type MetricKey = 'traffic' | 'newUsers' | 'sales' | 'conversion';

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

const fetchDashboardData = async (): Promise<DashboardMetric[]> => {
  await new Promise((resolve) => setTimeout(resolve, 400));

  return [
    {
      key: 'traffic',
      label: 'Traffic',
      valueLabel: '350,897',
      growth: '+3.48%',
      positive: true,
      color: '#10b981',
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
      color: '#22c55e',
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
      color: '#84cc16',
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
      color: '#14b8a6',
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

export const App = () => {
  const { data = [], isLoading } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: fetchDashboardData
  });

  const [activeMetric, setActiveMetric] = useState<MetricKey>('traffic');
  const [isGraphHovered, setIsGraphHovered] = useState(false);

  const selected = useMemo(
    () => data.find((item) => item.key === activeMetric) ?? data[0],
    [activeMetric, data]
  );

  useEffect(() => {
    if (!data.length || isGraphHovered) return;

    const interval = window.setInterval(() => {
      setActiveMetric((current) => {
        const currentIndex = data.findIndex((item) => item.key === current);
        const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % data.length;
        return data[nextIndex].key;
      });
    }, 5000);

    return () => window.clearInterval(interval);
  }, [data, isGraphHovered]);

  return (
    <main className="app-shell">
      <section className="metrics-grid">
        {data.map((metric) => (
          <button
            key={metric.key}
            className={`metric-card ${metric.key === selected?.key ? 'active' : ''}`}
            onClick={() => setActiveMetric(metric.key)}
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
                      <stop offset="100%" stopColor="#34d399" stopOpacity={0.9} />
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
                      border: '1px solid rgba(110, 231, 183, 0.35)',
                      backgroundColor: 'rgba(6, 78, 59, 0.9)',
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
    </main>
  );
};
