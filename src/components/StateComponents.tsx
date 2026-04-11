import React from "react";

interface ErrorStateProps {
  message: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message }) => {
  return (
    <section className="overview-card">
      <p className="overview-label">API Error</p>
      <h2>Dashboard data unavailable</h2>
      <p className="overview-subtitle">{message}</p>
    </section>
  );
};

interface NoDataStateProps {
  apiUrl: string;
}

export const NoDataState: React.FC<NoDataStateProps> = ({ apiUrl }) => {
  return (
    <section className="overview-card">
      <p className="overview-label">No Data</p>
      <h2>No dashboard metrics returned</h2>
      <p className="overview-subtitle">
        Expected the API to return a JSON array of dashboard metrics from{" "}
        {apiUrl}.
      </p>
    </section>
  );
};
