'use client';

import { useState } from 'react';

interface AutomateRevalidationButtonProps {
  page: string;
}

export default function AutomateRevalidationButton({ page }: AutomateRevalidationButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleRevalidate = async () => {
    console.log(' Button clicked! Page prop:', page);
    setIsLoading(true);
    
    try {
      const url = `/api/revalidate?page=${page}`;
      console.log(' Calling URL:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      console.log(' Response status:', response.status);
      console.log(' Response ok:', response.ok);

      if (response.ok) {
        const result = await response.json();
        console.log(' Revalidation successful:', result);
        
        // Add alert to confirm it worked
        alert(`Cache revalidated for ${result.page}!`);
        
        // Force hard refresh to bypass all caches
        setTimeout(() => {
          window.location.href = window.location.href + `?t=${Date.now()}`;
        }, 1000);
      } else {
        const errorData = await response.text();
        console.error(' Response error:', errorData);
        throw new Error(`Revalidation failed: ${response.status}`);
      }
    } catch (error) {
      console.error(' Revalidation failed:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Revalidation failed'}`);
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