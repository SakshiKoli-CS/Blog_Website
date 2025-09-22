import Link from 'next/link';

export default function TestCachePrimedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="text-center p-6 bg-white rounded shadow">
        <h1 className="text-2xl font-bold text-green-600 mb-3">
          ✅ Cache Primed Test
        </h1>
        
        <p className="mb-4">This page IS in launch.json</p>
        
        <div className="bg-green-100 p-3 rounded mb-4">
          <p className="font-bold">Expected: Cache HIT ⚡</p>
        </div>

        <div className="space-x-2">
          <Link href="/test-no-cache" className="bg-red-500 text-white px-3 py-2 rounded">
            No Cache →
          </Link>
          <Link href="/" className="bg-gray-500 text-white px-3 py-2 rounded">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
