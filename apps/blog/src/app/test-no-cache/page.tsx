import Link from 'next/link';

export default function TestNoCachePage() {
  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          ❌ No Cache Page
        </h1>
        
        <p className="text-lg mb-4">
          This page is <strong>NOT</strong> in launch.json
        </p>
        
        <div className="bg-red-100 p-4 rounded mb-6">
          <p className="font-bold">Expected: Cache MISS 🐌</p>
          <p className="text-sm">Load time: ~300ms</p>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Check DevTools Network tab → cf-cache-status
        </p>

        <div className="space-x-4">
          <Link href="/test-cache-primed" className="bg-green-500 text-white px-4 py-2 rounded inline-block">
            Compare Cache Primed →
          </Link>
          <Link href="/" className="bg-gray-500 text-white px-4 py-2 rounded inline-block">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
