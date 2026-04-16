import React from "react";
import { DepIcon } from "./DepIcon";
import { DependencyStatus } from "../constants/dependency-status";
import { getDependencyType } from "../utils/dependency.helper";
import type { DependencyCardProps } from "../types/dependency.types";

export const DependencyCard: React.FC<DependencyCardProps> = ({ dep }) => {
  const statusLower = dep.status.toLowerCase();

  return (
    <div className={`dep-card dep-card-${statusLower}`}>
      <div className="dep-card-header">
        <DepIcon name={dep.name} status={dep.status} />
        <span className="dep-card-name">{dep.name}</span>
      </div>

      <div className="dep-card-meta">
        <span className="dep-card-type">{getDependencyType(dep.name)}</span>
      </div>

      <div className="dep-card-footer">
        {dep.status === DependencyStatus.UP && (
          <span className="dep-card-status text-up">
            <i className="bi bi-check-circle-fill" /> {DependencyStatus.UP}
          </span>
        )}
        {dep.status === DependencyStatus.DOWN && (
          <span className="dep-card-status text-down">
            <i className="bi bi-x-circle-fill dep-status-icon-down" /> {DependencyStatus.DOWN}
          </span>
        )}
        {dep.status === DependencyStatus.WARN && (
          <span className="dep-card-status text-warn">
            <i className="bi bi-exclamation-triangle-fill" /> {DependencyStatus.WARN}
          </span>
        )}
      </div>
    </div>
  );
};
