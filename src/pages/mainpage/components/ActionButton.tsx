import React from 'react';

interface ActionButtonProps {
  text: string;
  onClick?: () => void;
  type?: "button" | "submit";
}

const ActionButton: React.FC<ActionButtonProps> = ({ text, onClick, type = "button" }) => {
  return (
    <button type={type} className="action-button" onClick={onClick}>
      <span className="button-text">{text}</span>
    </button>
  );
};

export default ActionButton;