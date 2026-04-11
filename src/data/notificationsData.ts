import type { AlertNotification } from "../models/dashboard";

export const notifications: AlertNotification[] = [
  {
    id: "n1",
    title: "Payments API down",
    message: "Checkout service is unreachable in us-east-1.",
    severity: "down",
    timestamp: "2 min ago",
  },
  {
    id: "n2",
    title: "CPU usage high",
    message: "Worker node #4 crossed 85% for the last 10 minutes.",
    severity: "warn",
    timestamp: "8 min ago",
  },
  {
    id: "n3",
    title: "Backup completed",
    message: "Nightly backup finished successfully.",
    severity: "ok",
    timestamp: "17 min ago",
  },
];
