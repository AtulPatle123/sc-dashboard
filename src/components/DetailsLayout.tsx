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
    <>
      <button className="back-button" onClick={onBackClick}>
        <span aria-hidden>←</span>
        Back to Dashboard
      </button>

      <div className="details-layout">
        <aside className="details-sidebar">
          {selected?.modules.map((module) => (
            <button
              key={module}
              className={`sidebar-item ${selectedModule === module ? "active" : ""}`}
              onClick={() => onModuleSelect(module)}
            >
              {module}
            </button>
          ))}
        </aside>

        <div className="details-content">{children}</div>
      </div>
    </>
  );
};
