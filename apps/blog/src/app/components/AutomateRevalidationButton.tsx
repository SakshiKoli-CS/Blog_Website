'use client';

import { useState } from 'react';

interface AutomateRevalidationButtonProps {
  page: string;
}

export default function AutomateRevalidationButton({ page }: AutomateRevalidationButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleRevalidate = async () => {
    setIsLoading(true);
    
    try {
     
      const response = await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page })
      });

      if (response.ok) {
        setTimeout(() => window.location.reload(), 500);
      }
    } catch (error) {
      console.error('Revalidation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleRevalidate}
      disabled={isLoading}
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 mt-4"
    >
      {isLoading ? 'Refreshing...' : 'onDemand Revalidation'}
    </button>
  );
}
