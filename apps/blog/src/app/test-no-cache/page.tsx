import Link from 'next/link';

export default function TestNoCachePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="text-center p-6 bg-white rounded shadow">
        <h1 className="text-2xl font-bold text-red-600 mb-3">
          ❌ No Cache Test
        </h1>
        
        <p className="mb-4">This page is NOT in launch.json</p>
        
        <div className="bg-red-100 p-3 rounded mb-4">
          <p className="font-bold">Expected: Cache MISS 🐌</p>
        </div>

        <div className="space-x-2">
          <Link href="/test-cache-primed" className="bg-green-500 text-white px-3 py-2 rounded">
            Cache Primed →
          </Link>
          <Link href="/" className="bg-gray-500 text-white px-3 py-2 rounded">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
