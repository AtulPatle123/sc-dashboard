import React, { Component } from "react";
import "../header/header.scss";

class Header extends Component {
  render() {
  
    return (
      <div className="se-header-profile-zone">
        <div className="container-fluid ">
          <div className="display-flex header-container">
            <p className="app-title">Centralized Matrix Dashboard</p>
            
            <div className="justcontent-space-center">
              <div className="display-inline">
                <img
                  src="./assets/se-logo.svg"
                  alt="Schneider Electric"
                  title="Schneider Electric"
                />
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
