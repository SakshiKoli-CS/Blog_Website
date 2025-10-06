import Link from 'next/link';
import LanguageSwitcher from "@/app/components/LanguageSwitcher";

export default function BlogLatestPage() {
  const latestPosts = [
    { id: 1, title: "AI in Healthcare", slug: "classics" },
    { id: 2, title: "Financial AI", slug: "live" },
    { id: 3, title: "Climate AI", slug: "updates" },
    { id: 4, title: "Neural Networks", slug: "neuralink" },
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Latest Posts</h1>
        <LanguageSwitcher />
      </div>
      
      <div style={{ marginTop: '20px' }}>
        {latestPosts.map((post) => (
          <div key={post.id} style={{ marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
            <h3>{post.title}</h3>
            <Link href={`/blog/${post.slug}`}>Read more</Link>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '30px' }}>
        <Link href="/">← Back to Home</Link>
      </div>
    </div>
  );
}
