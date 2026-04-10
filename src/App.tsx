import { type CSSProperties, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

type MetricKey = 'traffic' | 'newUsers' | 'sales' | 'conversion';
type SectionKey = 'health' | 'monitoring' | 'traffic' | 'xyz';
type ChartType = 'line' | 'area' | 'bar';

type Point = { label: string; value: number };

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
  caption: string;
  chartType: ChartType;
  color: string;
  points: Point[];
};

const fetchDashboardData = async (): Promise<DashboardMetric[]> => {
  await new Promise((resolve) => setTimeout(resolve, 350));

  return [
    {
      key: 'traffic',
      label: 'Traffic',
      valueLabel: '350,897',
      growth: '+3.48%',
      positive: true,
      color: '#6366f1',
      chart: [
        { label: 'May', value: 8 },
        { label: 'Jun', value: 20 },
        { label: 'Jul', value: 12 },
        { label: 'Aug', value: 30 },
        { label: 'Sep', value: 16 },
        { label: 'Oct', value: 40 },
        { label: 'Nov', value: 22 },
        { label: 'Dec', value: 58 }
      ]
    },
    {
      key: 'newUsers',
      label: 'New Users',
      valueLabel: '2,356',
      growth: '+2.20%',
      positive: true,
      color: '#06b6d4',
      chart: [
        { label: 'May', value: 22 },
        { label: 'Jun', value: 26 },
        { label: 'Jul', value: 21 },
        { label: 'Aug', value: 32 },
        { label: 'Sep', value: 27 },
        { label: 'Oct', value: 39 },
        { label: 'Nov', value: 35 },
        { label: 'Dec', value: 48 }
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
        { label: 'May', value: 6 },
        { label: 'Jun', value: 14 },
        { label: 'Jul', value: 11 },
        { label: 'Aug', value: 22 },
        { label: 'Sep', value: 19 },
        { label: 'Oct', value: 35 },
        { label: 'Nov', value: 27 },
        { label: 'Dec', value: 49 }
      ]
    },
    {
      key: 'conversion',
      label: 'Conversion',
      valueLabel: '49.65%',
      growth: '+4.18%',
      positive: true,
      color: '#ec4899',
      chart: [
        { label: 'May', value: 16 },
        { label: 'Jun', value: 18 },
        { label: 'Jul', value: 22 },
        { label: 'Aug', value: 23 },
        { label: 'Sep', value: 25 },
        { label: 'Oct', value: 31 },
        { label: 'Nov', value: 36 },
        { label: 'Dec', value: 44 }
      ]
    }
  ];
};

const detailData: Record<SectionKey, DetailCard[]> = {
  health: [
    {
      id: 'uptime',
      title: 'System Uptime',
      caption: 'Last 8 months stability',
      chartType: 'line',
      color: '#22c55e',
      points: [
        { label: 'May', value: 86 },
        { label: 'Jun', value: 88 },
        { label: 'Jul', value: 84 },
        { label: 'Aug', value: 91 },
        { label: 'Sep', value: 92 },
        { label: 'Oct', value: 94 },
        { label: 'Nov', value: 93 },
        { label: 'Dec', value: 96 }
      ]
    },
    {
      id: 'incidents',
      title: 'Incidents',
      caption: 'Monthly issue trend',
      chartType: 'bar',
      color: '#f43f5e',
      points: [
        { label: 'May', value: 18 },
        { label: 'Jun', value: 14 },
        { label: 'Jul', value: 15 },
        { label: 'Aug', value: 11 },
        { label: 'Sep', value: 10 },
        { label: 'Oct', value: 9 },
        { label: 'Nov', value: 7 },
        { label: 'Dec', value: 5 }
      ]
    }
  ],
  monitoring: [
    {
      id: 'latency',
      title: 'Latency',
      caption: 'Response in ms',
      chartType: 'area',
      color: '#38bdf8',
      points: [
        { label: 'Mon', value: 24 },
        { label: 'Tue', value: 18 },
        { label: 'Wed', value: 22 },
        { label: 'Thu', value: 17 },
        { label: 'Fri', value: 20 },
        { label: 'Sat', value: 14 },
        { label: 'Sun', value: 13 }
      ]
    },
    {
      id: 'memory',
      title: 'Memory Usage',
      caption: 'Usage profile',
      chartType: 'line',
      color: '#a78bfa',
      points: [
        { label: 'Mon', value: 58 },
        { label: 'Tue', value: 60 },
        { label: 'Wed', value: 62 },
        { label: 'Thu', value: 56 },
        { label: 'Fri', value: 61 },
        { label: 'Sat', value: 55 },
        { label: 'Sun', value: 53 }
      ]
    }
  ],
  traffic: [
    {
      id: 'source',
      title: 'Source Mix',
      caption: 'Channel comparison',
      chartType: 'bar',
      color: '#f59e0b',
      points: [
        { label: 'Organic', value: 42 },
        { label: 'Paid', value: 21 },
        { label: 'Direct', value: 28 },
        { label: 'Email', value: 16 },
        { label: 'Social', value: 34 }
      ]
    },
    {
      id: 'trend',
      title: 'Weekly Trend',
      caption: 'Traffic growth',
      chartType: 'area',
      color: '#14b8a6',
      points: [
        { label: 'W1', value: 12 },
        { label: 'W2', value: 20 },
        { label: 'W3', value: 16 },
        { label: 'W4', value: 28 },
        { label: 'W5', value: 32 }
      ]
    }
  ],
  xyz: [
    {
      id: 'capacity',
      title: 'Capacity',
      caption: 'Utilization overview',
      chartType: 'line',
      color: '#10b981',
      points: [
        { label: 'Q1', value: 48 },
        { label: 'Q2', value: 56 },
        { label: 'Q3', value: 52 },
        { label: 'Q4', value: 64 }
      ]
    },
    {
      id: 'availability',
      title: 'Availability',
      caption: 'Service uptime',
      chartType: 'bar',
      color: '#6366f1',
      points: [
        { label: 'Q1', value: 91 },
        { label: 'Q2', value: 93 },
        { label: 'Q3', value: 95 },
        { label: 'Q4', value: 96 }
      ]
    }
  ]
};

const renderChart = (type: ChartType, points: Point[], color: string) => {
  if (type === 'bar') {
    return (
      <BarChart data={points}>
        <CartesianGrid stroke="rgba(148, 163, 184, 0.2)" vertical={false} />
        <XAxis dataKey="label" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <Tooltip />
        <Bar dataKey="value" fill={color} radius={[8, 8, 0, 0]} />
      </BarChart>
    );
  }

  if (type === 'area') {
    return (
      <AreaChart data={points}>
        <defs>
          <linearGradient id="detailArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.45} />
            <stop offset="100%" stopColor={color} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(148, 163, 184, 0.2)" vertical={false} />
        <XAxis dataKey="label" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <Tooltip />
        <Area type="monotone" dataKey="value" stroke={color} strokeWidth={3} fill="url(#detailArea)" />
      </AreaChart>
    );
  }

  return (
    <LineChart data={points}>
      <CartesianGrid stroke="rgba(148, 163, 184, 0.2)" vertical={false} />
      <XAxis dataKey="label" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
      <Tooltip />
      <Line type="monotone" dataKey="value" stroke={color} strokeWidth={3} dot={{ fill: color }} />
    </LineChart>
  );
};

const DetailScreen = ({
  onBack,
  selectedMetric
}: {
  onBack: () => void;
  selectedMetric: DashboardMetric | undefined;
}) => {
  const [selectedSection, setSelectedSection] = useState<SectionKey>('health');
  const [selectedCard, setSelectedCard] = useState<string>(detailData.health[0].id);

  const sections: Array<{ key: SectionKey; label: string }> = [
    { key: 'health', label: 'Health Checkup' },
    { key: 'monitoring', label: 'Monitoring' },
    { key: 'traffic', label: 'Traffic' },
    { key: 'xyz', label: 'XYZ' }
  ];

  const cards = detailData[selectedSection];

  useEffect(() => {
    setSelectedCard(cards[0].id);
  }, [selectedSection]);

  const active = cards.find((card) => card.id === selectedCard) ?? cards[0];

  return (
    <section className="detail-layout">
      <aside className="detail-sidebar">
        <button className="back-button" onClick={onBack}>
          ← Back to Home
        </button>
        <h3>{selectedMetric?.label ?? 'Details'} Module</h3>
        {sections.map((section) => (
          <button
            key={section.key}
            className={`side-nav-btn ${selectedSection === section.key ? 'active' : ''}`}
            onClick={() => setSelectedSection(section.key)}
          >
            {section.label}
          </button>
        ))}
      </aside>

      <div className="detail-content">
        <div className="detail-cards-grid">
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => setSelectedCard(card.id)}
              className={`detail-card ${selectedCard === card.id ? 'active' : ''}`}
              style={{ '--card-color': card.color } as CSSProperties}
            >
              <h4>{card.title}</h4>
              <p>{card.caption}</p>
            </button>
          ))}
        </div>

        <motion.div
          key={active.id}
          className="detail-graph"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h4>{active.title} Graph</h4>
          <ResponsiveContainer width="100%" height={320}>
            {renderChart(active.chartType, active.points, active.color)}
          </ResponsiveContainer>
        </motion.div>
      </div>
    </section>
  );
};

export const App = () => {
  const { data = [], isLoading } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: fetchDashboardData
  });

  const [activeMetric, setActiveMetric] = useState<MetricKey>('traffic');
  const [isHovered, setIsHovered] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const activeIndex = data.findIndex((item) => item.key === activeMetric);
  const selectedMetric = useMemo(() => data[activeIndex] ?? data[0], [activeIndex, data]);

  const moveToMetric = (nextIndex: number) => {
    if (!data.length) return;
    const normalizedIndex = (nextIndex + data.length) % data.length;
    setActiveMetric(data[normalizedIndex].key);
  };

  useEffect(() => {
    if (!data.length || isHovered || showDetail) return;

    const timer = window.setInterval(() => {
      moveToMetric(activeIndex + 1);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [activeIndex, data, isHovered, showDetail]);

  if (showDetail) {
    return <DetailScreen onBack={() => setShowDetail(false)} selectedMetric={selectedMetric} />;
  }

  return (
    <main className="app-shell">
      <section className="metrics-grid">
        {data.map((metric) => (
          <button
            key={metric.key}
            className={`metric-card ${metric.key === selectedMetric?.key ? 'active' : ''}`}
            onClick={() => {
              setActiveMetric(metric.key);
              setShowDetail(true);
            }}
            style={{ '--accent': metric.color } as CSSProperties}
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
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="overview-header">
          <div>
            <p className="overview-label">Overview</p>
            <h2>{selectedMetric?.label} trend</h2>
            <p className="overview-subtitle">Auto slide every 5 seconds. Use arrows for manual carousel.</p>
          </div>

          <div className="carousel-controls">
            <button aria-label="Previous" onClick={() => moveToMetric(activeIndex - 1)}>
              ‹
            </button>
            <button aria-label="Next" onClick={() => moveToMetric(activeIndex + 1)}>
              ›
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="loading">Loading chart data…</div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedMetric?.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="chart-wrap"
            >
              <ResponsiveContainer width="100%" height={360}>
                <AreaChart data={selectedMetric?.chart}>
                  <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={selectedMetric?.color} stopOpacity={0.7} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.9} />
                    </linearGradient>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={selectedMetric?.color} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={selectedMetric?.color} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(148, 163, 184, 0.15)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: '#cbd5e1', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#cbd5e1', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: '1px solid rgba(129, 140, 248, 0.35)',
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      color: '#f8fafc'
                    }}
                  />
                  <Area type="monotone" dataKey="value" fill="url(#areaGradient)" strokeOpacity={0} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="url(#lineGradient)"
                    strokeWidth={4}
                    dot={{ r: 4, strokeWidth: 0, fill: selectedMetric?.color }}
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
