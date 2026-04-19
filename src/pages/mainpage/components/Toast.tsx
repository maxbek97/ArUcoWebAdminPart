import React, { useEffect } from "react";
import "./Toast.css";

type Props = {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
};

const Toast: React.FC<Props> = ({ message, type = "error", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`toast ${type}`}>
      {message}
    </div>
  );
};

export default Toast;