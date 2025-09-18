import { getUpdatesPosts } from "../../../lib/contentstack"
import { detectLocale } from "../../../lib/detectLocale"
import Image from "next/image"

interface BlogEntry {
  title: string
  url: string
  content: string
  author: string
  category: string
  image?: { url: string; title?: string }
  date?: string
  tags?: string[]
}

export default async function UpdatesPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>
}) {
  const { lang } = await searchParams
  const locale = lang || (await detectLocale())

  const posts: BlogEntry[] = (await getUpdatesPosts()) as BlogEntry[]

  if (!posts.length) {
    return <p className="text-center py-10 text-red-500">No Updates posts found.</p>
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Updates</h1>
      {posts.map((post) => (
        <div key={post.url} className="mb-10 p-6 border rounded-lg shadow">
          {post.image?.url && (
            <Image
              src={post.image.url}
              alt={post.image.title || post.title}
              width={1200}
              height={500}
              className="w-full h-64 object-cover rounded-xl"
            />
          )}
          <h2 className="text-2xl font-semibold mt-4">{post.title}</h2>
          <p className="text-gray-500 text-sm">
            By {post.author} • {post.category}{" "}
            {post.date && `• ${new Date(post.date).toLocaleDateString()}`}
          </p>
          {post.tags && (
            <div className="flex flex-wrap gap-2 mt-2">
              {post.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          <div
            className="prose mt-4"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      ))}
    </div>
  )
}
