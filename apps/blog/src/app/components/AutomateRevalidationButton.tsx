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
     
      const response = await fetch(`/api/revalidate?page=${page}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const result = await response.json();
        console.log(' Revalidation successful:', result);
      
        window.location.reload();
      } else {
        throw new Error('Revalidation failed');
      }
    } catch (error) {
      console.error(' Revalidation failed:', error);
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
