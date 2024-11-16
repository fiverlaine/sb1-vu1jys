import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  className = ''
}) => (
  <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
    <p className="text-gray-600">{message}</p>
  </div>
);

export default LoadingSpinner;