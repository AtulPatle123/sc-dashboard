import React from "react";
import type { PlatformHealth } from "../models/dashboard";

interface ServicesListProps {
  selected: PlatformHealth | undefined;
  isLoading: boolean;
}

export const ServicesList: React.FC<ServicesListProps> = ({
  selected,
  isLoading,
}) => {
  if (isLoading) {
    return <div className="loading">Loading services…</div>;
  }

  if (!selected?.modulesResponse || selected.modulesResponse.length === 0) {
    return <p className="no-services">No services available</p>;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "UP":
        return "✓";
      case "DOWN":
        return "✕";
      case "WARN":
        return "⚠";
      default:
        return "●";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "UP":
        return "#10B981"; // green
      case "DOWN":
        return "#EF4444"; // red
      case "WARN":
        return "#F59E0B"; // yellow
      default:
        return "#6B7280"; // gray
    }
  };

  return (
    <div className="services-list">
      <h3>Services</h3>
      <div className="services-container">
        {selected.modulesResponse.map((service, index) => (
          <div
            key={index}
            className={`service-item service-${service.status.toLowerCase()}`}
            style={{
              borderLeftColor: getStatusColor(service.status),
            }}
          >
            <div className="service-header">
              <div className="service-status-badge">
                <span
                  className="status-icon"
                  style={{ color: getStatusColor(service.status) }}
                >
                  {getStatusIcon(service.status)}
                </span>
              </div>
              <div className="service-info">
                <h4 className="service-name">{service.name}</h4>
                <p className="service-version">v{service.version}</p>
              </div>
              <div className="service-instances">
                <span className="instance-badge">
                  {service.noOfInstances} instance
                  {service.noOfInstances !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {service.dependencies && service.dependencies.length > 0 && (
              <div className="service-dependencies">
                <p className="dep-label">Dependencies:</p>
                <div className="dep-list">
                  {service.dependencies.map((dep, depIndex) => (
                    <div key={depIndex} className="dep-item">
                      <span
                        className="dep-status"
                        style={{ color: getStatusColor(dep.status) }}
                      >
                        {getStatusIcon(dep.status)}
                      </span>
                      <span className="dep-name">{dep.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
