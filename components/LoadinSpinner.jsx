'use client';

import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-orange-500`} />
      {text && (
        <p className="text-gray-600 text-sm">{text}</p>
      )}
    </div>
  );
}