import { getHealthcarePost } from "@/app/lib/contentstack";
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

export default async function ClassicsPage() {
  const entry: BlogEntry | null = await getHealthcarePost();

  if (!entry) {
    return <p className="text-center py-10 text-red-500">No Healthcare post found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Classics</h1>
      
      <div className="mb-8 p-6 border rounded-lg shadow">
        {entry.image?.url && (
          <Image
            src={entry.image.url}
            alt={entry.image.title || entry.title}
            width={1200}
            height={500}
            className="w-full h-64 object-cover rounded-xl mb-4"
          />
        )}
        
        <h2 className="text-2xl font-semibold">{entry.title}</h2>
        <p className="text-gray-500 text-sm mt-2">
          By {entry.author} • {entry.category}
          {entry.date && ` • ${new Date(entry.date).toLocaleDateString()}`}
        </p>
        
        <div
          className="prose mt-4"
          dangerouslySetInnerHTML={{ __html: entry.content }}
        />
      </div>
    </div>
  );
}