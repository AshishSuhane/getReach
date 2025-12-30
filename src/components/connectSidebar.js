import React from "react";

function ConnectSidebar({ onClose, onVerify }) {
  return (
    <div className="sidebar-backdrop">
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>Connect LinkedIn account</h3>
          <span className="close-btn" onClick={onClose}>
            ✕
          </span>
        </div>

        <p className="sidebar-subtitle">
          How do you want to connect your LinkedIn account?
        </p>

        <button onClick={()=>onVerify('infinite')} className="sidebar-option sidebar-option--primary">
          <div className="sidebar-option-icon">∞</div>
          <div className="sidebar-option-content">
            <div className="sidebar-option-title-row">
              <span className="sidebar-option-title">Infinite Login</span>
              <span className="sidebar-option-badge">Your best choice</span>
            </div>
            <p className="sidebar-option-subtitle">
              LinkedIn Credentials + 2FA
            </p>
            <p className="sidebar-option-description">
              Select this option to keep your LinkedIn account always connected.
              No more disconnection issues.
            </p>
          </div>
        </button>

        <button onClick={()=>onVerify('cred')} className="sidebar-option">
          <div className="sidebar-option-icon">in</div>
          <div className="sidebar-option-content">
            <span className="sidebar-option-title">Credentials Login</span>
            <p className="sidebar-option-description">
              Login securely using your LinkedIn account credentials.
            </p>
          </div>
        </button>

        <button className="sidebar-option">
          <div className="sidebar-option-icon">⚙</div>
          <div className="sidebar-option-content">
            <span className="sidebar-option-title">Login with extension</span>
            <p className="sidebar-option-description">
              Quickly access HeyReach by connecting your account directly using
              the LinkedIn session in this browser.
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}

export default ConnectSidebar;
