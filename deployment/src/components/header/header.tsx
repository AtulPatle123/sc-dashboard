import React from "react";
import "../header/header.scss";

interface HeaderProps {
  rightSlot?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ rightSlot }) => {
  return (
    <div className="se-header-profile-zone">
      <div className="header-inner">
        {/* Left: Logo + Brand */}
        <div className="header-brand">
          <img
            src="./assets/se-logo.svg"
            alt="Schneider Electric"
            title="Schneider Electric"
            className="header-logo"
          />
          <div className="header-brand-divider" />
          <div className="header-brand-text">
            <span className="header-title">SELECT AND CONFIG DASHBOARD</span>
          </div>
        </div>

        {/* Right: Notification slot */}
        {rightSlot && <div className="header-right">{rightSlot}</div>}
      </div>
    </div>
  );
};

export default Header;
