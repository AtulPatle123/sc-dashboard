import React from "react";
import type { PlatformHealth } from "../models/dashboard";

interface DetailsKPIStripProps {
  selected: PlatformHealth | undefined;
}

export const DetailsKPIStrip: React.FC<DetailsKPIStripProps> = ({
  selected,
}) => {
  return (
    <section className="details-kpi-strip">
      <article className="kpi-pill">
        <p>Current Status</p>
        <strong>{selected?.overallStatus ?? "--"}</strong>
      </article>
      <article className="kpi-pill">
        <p>Platform</p>
        <strong>{selected?.platform ?? "--"}</strong>
      </article>
      <article className="kpi-pill">
        <p>Modules</p>
        <strong>{selected?.modules.length ?? 0}</strong>
      </article>
    </section>
  );
};
