import Link from 'next/link';

export default function TestCachePrimedPage() {
  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          ✅ Cache Primed Page
        </h1>
        
        <p className="text-lg mb-4">
          This page <strong>IS</strong> in launch.json
        </p>
        
        <div className="bg-green-100 p-4 rounded mb-6">
          <p className="font-bold">Expected: Cache HIT ⚡</p>
          <p className="text-sm">Load time: ~50ms</p>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Check DevTools Network tab → cf-cache-status
        </p>

        <div className="space-x-4">
          <Link href="/test-no-cache" className="bg-red-500 text-white px-4 py-2 rounded inline-block">
            Compare No Cache →
          </Link>
          <Link href="/" className="bg-gray-500 text-white px-4 py-2 rounded inline-block">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
