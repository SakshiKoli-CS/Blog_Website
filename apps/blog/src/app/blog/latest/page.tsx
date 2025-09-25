import Link from 'next/link';

export default function BlogLatestPage() {
  // Latest blog posts
  const latestPosts = [
    { id: 1, title: "AI in Healthcare", slug: "ai-healthcare", date: "2025-01-15" },
    { id: 2, title: "Financial AI", slug: "financial-ai", date: "2025-01-14" },
    { id: 3, title: "Climate AI", slug: "climate-ai", date: "2025-01-13" },
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Latest Blog Posts</h1>
      <p>The most recent articles</p>

      <div style={{ marginTop: '20px' }}>
        {latestPosts.map((post) => (
          <div key={post.id} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc' }}>
            <h3>{post.title}</h3>
            <p style={{ color: '#666', fontSize: '14px' }}>Published: {post.date}</p>
            <Link href={`/blog/${post.slug}`}>Read more</Link>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px' }}>
        <Link href="/">Back to Home</Link>
      </div>
    </div>
  );
}
