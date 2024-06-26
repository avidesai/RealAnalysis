import React, { useState } from 'react';
import './InfoTooltip.css';

const InfoTooltip = ({ description }) => {
  const [isVisible, setIsVisible] = useState(false);

  const showTooltip = () => {
    setIsVisible(true);
  };

  const hideTooltip = () => {
    setIsVisible(false);
  };

  return (
    <div className="info-tooltip-container" onMouseLeave={hideTooltip}>
      <span className="info-icon" onMouseEnter={showTooltip} onClick={showTooltip}>
        ⓘ
      </span>
      {isVisible && (
        <div className="tooltip">
          {description}
        </div>
      )}
    </div>
  );
};

export default InfoTooltip;
