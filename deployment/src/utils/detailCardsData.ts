import type { DetailNavKey, DetailCard } from "../models/dashboard";

export const detailCardsByNav: Record<DetailNavKey, DetailCard[]> = {
  healthCheckup: [
    {
      id: "hc-1",
      title: "Vitals Stability",
      subtitle: "Track baseline health trends",
      metricKey: "SEMTECH",
    },
    {
      id: "hc-2",
      title: "Recovery Index",
      subtitle: "Follow improvement trajectory",
      metricKey: "CMM",
    },
  ],
  monitoring: [
    {
      id: "mn-1",
      title: "Live Monitoring",
      subtitle: "Real-time usage and alerts",
      metricKey: "ADS",
    },
    {
      id: "mn-2",
      title: "Watchlist Status",
      subtitle: "Observe systems in focus",
      metricKey: "USM",
    },
  ],
  SEMTECH: [
    {
      id: "tf-1",
      title: "Inbound Flow",
      subtitle: "Source and session patterns",
      metricKey: "SEMTECH",
    },
    {
      id: "tf-2",
      title: "Channel Split",
      subtitle: "Compare segment performance",
      metricKey: "USM",
    },
  ],
  xyz: [
    {
      id: "xy-1",
      title: "XYZ Momentum",
      subtitle: "Dummy KPI performance pulse",
      metricKey: "CMM",
    },
    {
      id: "xy-2",
      title: "XYZ Reliability",
      subtitle: "Operational confidence score",
      metricKey: "ADS",
    },
  ],
};
