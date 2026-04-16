import React from "react";
import { DependencyStatus } from "../constants/dependency-status";
import type { DependencyStatusFooterProps } from "../types/dependency.types";

export const DependencyStatusFooter: React.FC<DependencyStatusFooterProps> = ({
  upCount,
  warnCount,
  downCount,
  timestamp,
}) => {
  const formattedTime = timestamp ? new Date(timestamp).toLocaleString() : undefined;

  return (
    <div className="dep-status-footer">
      <div className="dep-status-footer-left">
        {upCount > 0 && (
          <span className="dep-footer-badge dep-footer-up">
            <i className="bi bi-check-circle-fill" />
            {upCount} {DependencyStatus.UP}
          </span>
        )}
        {warnCount > 0 && (
          <span className="dep-footer-badge dep-footer-warn">
            <i className="bi bi-exclamation-triangle-fill" />
            {warnCount} {DependencyStatus.WARN}
          </span>
        )}
        {downCount > 0 && (
          <span className="dep-footer-badge dep-footer-down">
            <i className="bi bi-x-circle-fill" />
            {downCount} {DependencyStatus.DOWN}
          </span>
        )}
      </div>

      <div className="dep-status-footer-right">
        {downCount === 0 ? (
          <span className="dep-footer-time dep-footer-time-up">
            <i className="bi bi-arrow-up-circle" />
            Last up:&nbsp;<strong>{formattedTime ?? "just now"}</strong>
          </span>
        ) : (
          <span className="dep-footer-time dep-footer-time-down">
            <i className="bi bi-arrow-down-circle" />
            Last down detected:&nbsp;<strong>{formattedTime ?? "recently"}</strong>
          </span>
        )}
      </div>
    </div>
  );
};
