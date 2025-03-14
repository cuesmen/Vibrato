import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SidebarButton({ Icon, Title, GoTo, onClose }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (GoTo) {
      navigate(GoTo);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="Sidebar_Button" onClick={handleClick}>
      <div className="Sidebar_Button_Icon">
        {Icon}
      </div>
      <div className="Sidebar_Button_Title">
        {Title}
      </div>
    </div>
  );
}
