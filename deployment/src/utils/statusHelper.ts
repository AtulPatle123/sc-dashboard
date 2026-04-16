// Status color utilities
export const getStatusColor = (status: string): string => {
  switch (status) {
    case "UP":
      return "#10B981"; // green
    case "WARN":
      return "#F59E0B"; // yellow
    case "DOWN":
      return "#EF4444"; // red
    default:
      return "#6B7280"; // gray
  }
};

export const getStatusSecondaryColor = (status: string): string => {
  switch (status) {
    case "UP":
      return "#6EE7B7"; // light green
    case "WARN":
      return "#FCD34D"; // light yellow
    case "DOWN":
      return "#FCA5A5"; // light red
    default:
      return "#D1D5DB"; // light gray
  }
};

export const getStatusCounts = (
  modulesResponse: Array<{ status: string }> | undefined,
): Record<string, number> => {
  return (
    modulesResponse?.reduce(
      (acc, module) => {
        acc[module.status] = (acc[module.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    ) || {}
  );
};

export const getPieChartData = (statusCounts: Record<string, number>) => {
  return Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    value: count,
    fill:
      status === "UP" ? "#10B981" : status === "DOWN" ? "#EF4444" : "#F59E0B",
  }));
};
