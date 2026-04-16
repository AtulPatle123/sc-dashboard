import type { MetricKey, PlatformHealth } from "../models/dashboard";

export const getNextMetric = (
  data: PlatformHealth[],
  activeMetric: MetricKey,
  direction: "next" | "prev",
): MetricKey => {
  const currentIndex = data.findIndex((item) => item.platform === activeMetric);
  if (currentIndex === -1) return data[0].platform as MetricKey;

  const delta = direction === "next" ? 1 : -1;
  const nextIndex = (currentIndex + delta + data.length) % data.length;
  return data[nextIndex].platform as MetricKey;
};
