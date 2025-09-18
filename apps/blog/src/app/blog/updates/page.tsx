import { getClimatePost } from "../../lib/contentstack";
import Image from "next/image";

interface BlogEntry {
  title: string;
  url: string;
  content: string;
  author: string;
  category: string;
  image?: { url: string; title?: string };
  date?: string;
}

export default async function UpdatesPage() {
  const entry: BlogEntry | null = await getClimatePost();

  if (!entry) {
    return <p className="text-center py-10 text-red-500">No Climate post found.</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Blog
            </h1>
            <nav className="flex space-x-6">
              <a href="/blog/classics" className="text-gray-600 hover:text-purple-600 transition-colors">Classics</a>
              <a href="/blog/live" className="text-gray-600 hover:text-purple-600 transition-colors">Live</a>
              <a href="/blog/updates" className="text-purple-600 font-semibold border-b-2 border-purple-600 pb-1">Updates</a>
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {entry.image?.url && (
            <div className="relative h-80 overflow-hidden">
              <Image
                src={entry.image.url}
                alt={entry.image.title || entry.title}
                width={1200}
                height={500}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          )}
          
          <div className="p-8">
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-semibold rounded-full">
                {entry.category}
              </span>
              {entry.date && (
                <span className="text-gray-500 text-sm">
                  {new Date(entry.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              )}
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {entry.title}
            </h1>
            
            <div className="flex items-center mb-8 pb-6 border-b border-gray-200">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {entry.author.charAt(0)}
              </div>
              <div className="ml-4">
                <p className="font-semibold text-gray-900">{entry.author}</p>
                <p className="text-gray-500 text-sm">Climate AI Expert</p>
              </div>
            </div>
            
            <div
              className="prose prose-lg prose-purple max-w-none leading-relaxed text-gray-700"
              dangerouslySetInnerHTML={{ __html: entry.content }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}