// src/components/CashFlowForm/Alert.js
import React from 'react';

export const Alert = ({ children, variant = 'default', className = '' }) => {
  const baseClasses = 'p-4 mb-4 rounded-lg';
  const variantClasses = {
    default: 'bg-blue-100 text-blue-900',
    destructive: 'bg-red-100 text-red-900',
    success: 'bg-green-100 text-green-900',
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} role="alert">
      {children}
    </div>
  );
};

export const AlertDescription = ({ children }) => (
  <div className="text-sm">{children}</div>
);