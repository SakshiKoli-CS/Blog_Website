import stack from '../../../lib/contentstack'

async function getLive() {
  const Query = stack.ContentType('news_post').Query()
  Query.toJSON()
  const response = await Query.find()
  const entries = response?.[0] || []
  return entries.filter((post: any) => post.post_type === 'Live')
}

export default async function LivePage() {
  const posts = await getLive()

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Live</h1>
      {posts.map((post: any) => (
        <div key={post.uid} className="mb-8 p-6 border rounded-lg shadow">
          <h2 className="text-2xl font-semibold">{post.title}</h2>
          <p className="text-gray-500 text-sm">By {post.author}</p>
        </div>
      ))}
    </div>
  )
}
