import Link from 'next/link';
import { getCachePrimePost } from '../../lib/contentstack';

export const revalidate = 600;
interface CachePrimeEntry {
  title: string;
  content: string;
  url: string;
  created_at: string;
  updated_at: string;
  cache?: {
    cachepriming?: {
      urls: string[];
    };
  };
}

export default async function CachePrimePage() {
  const entry: CachePrimeEntry | null = await getCachePrimePost();

  if (!entry) {
    return (
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <h1>Cache Prime Post Not Found</h1>
        <p>The cache priming test post could not be loaded from CMS.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>{entry.title}</h1>
      
      <div style={{ marginTop: '20px' }}>
        {entry.content}
      </div>

      <div style={{ marginTop: '30px' }}>
        <Link href="/">← Back to Home</Link>
      </div>
    </div>
  );
}
