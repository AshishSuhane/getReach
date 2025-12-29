import React, { useEffect } from 'react';
import {
  IoMdCheckmarkCircle,
  IoMdCloseCircle,
  IoMdAlert,
} from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

const alertTypes = {
  success: {
    icon: <IoMdCheckmarkCircle className="alert-icon success-icon" />,
    containerClass: "alert-success",
  },
  error: {
    icon: <IoMdCloseCircle className="alert-icon error-icon" />,
    containerClass: "alert-error",
  },
  warning: {
    icon: <IoMdAlert className="alert-icon warning-icon" />,
    containerClass: "alert-warning",
  },
};

const AlertBox = ({
  type = "success",
  message = "This is an alert",
  onClose,
  duration = 2000,
}) => {
  const { icon, containerClass } = alertTypes[type] || alertTypes.success;

  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className={`alert-box ${containerClass}`}>
      <div className="alert-icon-wrapper">{icon}</div>

      <div className="alert-message">
        {message}
      </div>

      {onClose && (
        <button onClick={onClose} className="alert-close-btn">
          <RxCross2 />
        </button>
      )}
    </div>
  );
};

export default AlertBox;
