import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  title = 'Error', 
  message, 
  onRetry,
  className = ''
}) => (
  <div className={`rounded-lg bg-red-50 p-6 ${className}`}>
    <div className="flex items-center">
      <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
      <h3 className="text-lg font-medium text-red-800">{title}</h3>
    </div>
    <div className="mt-3">
      <p className="text-sm text-red-700">{message}</p>
    </div>
    {onRetry && (
      <div className="mt-4">
        <button
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </button>
      </div>
    )}
  </div>
);

export default ErrorMessage;