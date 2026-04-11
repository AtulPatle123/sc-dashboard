import React from "react";
import type { PlatformHealth } from "../models/dashboard";

interface DetailsLayoutProps {
  selected: PlatformHealth | undefined;
  selectedModule: string;
  onModuleSelect: (module: string) => void;
  onBackClick: () => void;
  children: React.ReactNode;
}

export const DetailsLayout: React.FC<DetailsLayoutProps> = ({
  selected,
  selectedModule,
  onModuleSelect,
  onBackClick,
  children,
}) => {
  return (
    <div className="details-layout">
      <aside className="details-sidebar">
        <div className="sidebar-header">
          <button className="back-button" onClick={onBackClick}>
            <i className="bi bi-arrow-left" aria-hidden="true"></i>
            <span>Back</span>
          </button>
        </div>
        <nav className="sidebar-nav">
          {selected?.modules.map((module) => (
            <button
              key={module}
              className={`sidebar-item ${selectedModule === module ? "active" : ""}`}
              onClick={() => onModuleSelect(module)}
            >
              {module}
            </button>
          ))}
        </nav>
      </aside>

      <div className="details-content">{children}</div>
    </div>
  );
};
