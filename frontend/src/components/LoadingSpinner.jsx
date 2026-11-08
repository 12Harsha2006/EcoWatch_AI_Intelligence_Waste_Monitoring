import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ text = 'Loading surveillance data...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <Loader2 className="h-9 w-9 animate-spin text-[#4CAF50]" />
      <p className="mt-3 text-sm font-semibold text-[#173B2A]">{text}</p>
    </div>
  );
}
