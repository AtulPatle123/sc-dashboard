import React from "react";
import type { AlertNotification } from "../models/dashboard";
import { motion, AnimatePresence } from "framer-motion";
import { notificationIconBySeverity } from "../utils/notificationHelper";

interface NotificationsPanelProps {
  isVisible: boolean;
  notifications: AlertNotification[];
  onClose: () => void;
  isLoading?: boolean;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  isVisible,
  notifications,
  onClose,
  isLoading = false,
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.section
          className="notification-panel"
          initial={{ opacity: 0, y: -12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.98 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <div className="notif-panel-header">
            <span className="notif-panel-title">Notifications</span>
            <button
              className="notif-close-btn"
              onClick={onClose}
              aria-label="Close notifications"
            >
              <i className="bi bi-x-lg" aria-hidden="true" />
            </button>
          </div>
          <div className="notif-panel-content">
            {isLoading ? (
              <div className="notif-empty-state">
                <i className="bi bi-arrow-repeat notif-loading-spin" aria-hidden="true" />
                <p>Fetching live status…</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="notif-empty-state">
                <i className="bi bi-check-circle" aria-hidden="true" />
                <p>All systems operational</p>
              </div>
            ) : (
              notifications.map((item, index) => (
                <motion.article
                  key={item.id}
                  className={`notification-item ${item.severity}`}
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="notification-row">
                    <h3>
                      <span className="severity-icon">
                        {notificationIconBySeverity[item.severity]}
                      </span>
                      {item.title}
                    </h3>
                    <span>{item.timestamp}</span>
                  </div>
                  <p>{item.message}</p>
                </motion.article>
              ))
            )}
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
};
