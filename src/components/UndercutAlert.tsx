import React from 'react';

interface AlertProps {
  type: 'WARNING' | 'OPPORTUNITY';
  message: string;
  severity: 'INFO' | 'CRITICAL';
}

const UndercutAlert: React.FC<AlertProps> = ({ type, message, severity }) => {
  const getAlertStyle = () => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-500 text-white';
      case 'INFO':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className={`p-4 rounded-md ${getAlertStyle()}`}>
      <h4 className="font-bold">{type === 'WARNING' ? 'Warning' : 'Opportunity'}</h4>
      <p>{message}</p>
    </div>
  );
};

export default UndercutAlert;