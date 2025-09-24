import Link from 'next/link';

interface BlogPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page as string) : 1;


  const blogPosts = [
    { id: 1, title: "AI in Healthcare", slug: "ai-healthcare" },
    { id: 2, title: "Financial AI", slug: "financial-ai" },
    { id: 3, title: "Climate AI", slug: "climate-ai" },
    { id: 4, title: "Machine Learning", slug: "ml-medicine" },
    { id: 5, title: "Blockchain AI", slug: "blockchain-ai" },
    { id: 6, title: "Future AI", slug: "future-ai" },
  ];

  const postsPerPage = 3;
  const startIndex = (page - 1) * postsPerPage;
  const currentPosts = blogPosts.slice(startIndex, startIndex + postsPerPage);
  const totalPages = Math.ceil(blogPosts.length / postsPerPage);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Blog - Page {page}</h1>
      <p>Showing {currentPosts.length} of {blogPosts.length} posts</p>

      <div style={{ marginTop: '20px' }}>
        {currentPosts.map((post) => (
          <div key={post.id} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc' }}>
            <h3>{post.title}</h3>
            <Link href={`/blog/${post.slug}`}>Read more</Link>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px' }}>
        {page > 1 && (
          <Link href={`/blog?page=${page - 1}`} style={{ marginRight: '10px' }}>
            Previous
          </Link>
        )}
        
        <span>Page {page} of {totalPages}</span>
        
        {page < totalPages && (
          <Link href={`/blog?page=${page + 1}`} style={{ marginLeft: '10px' }}>
            Next
          </Link>
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        <Link href="/">Back to Home</Link>
      </div>
    </div>
  );
}
