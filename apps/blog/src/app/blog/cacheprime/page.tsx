import Link from 'next/link';
import { getCachePrimePost } from '../../lib/contentstack';

// Cache this page for 10 minutes
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">❌ Cache Prime Post Not Found</h1>
          <p className="text-gray-400">The cache priming test post could not be loaded from CMS.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <header className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-green-400 font-medium">
              ✅ Cache Priming Test Page
            </span>
            <span className="text-xs text-gray-400">
              ISR: {revalidate}s • {new Date().toLocaleTimeString()}
            </span>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">{entry.title}</h1>
          
          <div className="text-sm text-gray-300 space-y-1">
            <p><strong>URL:</strong> {entry.url}</p>
            <p><strong>Created:</strong> {new Date(entry.created_at).toLocaleString()}</p>
            <p><strong>Updated:</strong> {new Date(entry.updated_at).toLocaleString()}</p>
          </div>
        </header>

        <article className="mb-8">
          <div className="prose prose-lg prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: entry.content.replace(/\n/g, '<br>') }} />
          </div>
        </article>

        {/* Cache Priming Info */}
        {entry.cache?.cachepriming?.urls && (
          <div className="bg-gray-800/50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold mb-3 text-green-400">🚀 Cache Priming URLs</h3>
            <ul className="space-y-1">
              {entry.cache.cachepriming.urls.map((url, index) => (
                <li key={index} className="text-gray-300">
                  <code className="bg-gray-700 px-2 py-1 rounded text-sm">{url}</code>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Test Info */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3 text-blue-400">🧪 Test Information</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-300"><strong>Purpose:</strong> Testing dynamic cache priming</p>
              <p className="text-gray-300"><strong>Build Process:</strong> Generates launch.json</p>
              <p className="text-gray-300"><strong>ISR Cache:</strong> {revalidate} seconds</p>
            </div>
            <div>
              <p className="text-gray-300"><strong>Cache Status:</strong> Check network tab</p>
              <p className="text-gray-300"><strong>CDN Cache:</strong> Check cf-cache-status header</p>
              <p className="text-gray-300"><strong>Next.js Cache:</strong> Static regeneration enabled</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link 
            href="/"
            className="inline-block bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
