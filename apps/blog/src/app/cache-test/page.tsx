import Link from 'next/link';

export default function CacheTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-2xl bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold mb-8">🧪 Cache Test</h1>
        
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h2 className="text-xl font-bold text-green-600 mb-2">✅ With Cache</h2>
            <p className="text-sm mb-4">In launch.json</p>
            <Link href="/test-cache-primed" className="bg-green-500 text-white px-4 py-2 rounded block">
              Test →
            </Link>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h2 className="text-xl font-bold text-red-600 mb-2">❌ No Cache</h2>
            <p className="text-sm mb-4">NOT in launch.json</p>
            <Link href="/test-no-cache" className="bg-red-500 text-white px-4 py-2 rounded block">
              Test →
            </Link>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="font-bold mb-2">How to Test:</h3>
          <p className="text-sm">Open DevTools → Network tab → Compare load times</p>
        </div>

        <Link href="/" className="bg-gray-500 text-white px-6 py-2 rounded inline-block">
          ← Home
        </Link>
      </div>
    </div>
  );
}
