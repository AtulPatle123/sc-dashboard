import React from "react";
import type { PlatformHealth } from "../models/dashboard";

interface ModuleDetailsProps {
  selected: PlatformHealth | undefined;
  selectedModule: string;
}

export const ModuleDetails: React.FC<ModuleDetailsProps> = ({
  selected,
  selectedModule,
}) => {
  const moduleInfo = selected?.modulesResponse.find(
    (m: any) =>
      m.name.includes(selectedModule.split("-").slice(-1)[0]) ||
      m.name === selectedModule,
  );

  if (!moduleInfo) {
    return <p>Select a module from the sidebar to view details.</p>;
  }

  return (
    <div>
      <div className="module-status">
        <strong>Status:</strong>{" "}
        <span className={`status-${moduleInfo.status.toLowerCase()}`}>
          {moduleInfo.status}
        </span>
      </div>
      <div className="module-version">
        <strong>Version:</strong> {moduleInfo.version}
      </div>
      <div className="module-instances">
        <strong>Instances:</strong> {moduleInfo.noOfInstances}
      </div>
      <div className="module-dependencies">
        <strong>Dependencies:</strong>
        <ul>
          {moduleInfo.dependencies.map((dep: any, index: number) => (
            <li key={index}>
              {dep.name}:{" "}
              <span className={`status-${dep.status.toLowerCase()}`}>
                {dep.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
