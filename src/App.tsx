import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
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
      color: '#2dd4bf',
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
      color: '#fb7185',
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
      color: '#f59e0b',
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
      color: '#38bdf8',
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

  const selected = useMemo(
    () => data.find((item) => item.key === activeMetric) ?? data[0],
    [activeMetric, data]
  );

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

      <section className="overview-card">
        <div className="overview-header">
          <div>
            <p className="overview-label">Overview</p>
            <h2>{selected?.label} trend</h2>
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
                <LineChart data={selected?.chart}>
                  <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={selected?.color} stopOpacity={0.7} />
                      <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.9} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(148, 163, 184, 0.15)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: '#cbd5e1', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#cbd5e1', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: '1px solid rgba(148, 163, 184, 0.25)',
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      color: '#f8fafc'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="url(#lineGradient)"
                    strokeWidth={4}
                    dot={{ r: 4, strokeWidth: 0, fill: selected?.color }}
                    activeDot={{ r: 6 }}
                    animationDuration={650}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </AnimatePresence>
        )}
      </section>
    </main>
  );
};
