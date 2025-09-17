import stack from '../../../lib/contentstack'

interface Post {
  uid: string
  title: string
  author: string
  post_type: string
  [key: string]: any
}

async function getClassics(): Promise<Post[]> {
  const Query = stack.ContentType('news_post').Query()
  Query.toJSON()
  const response = await Query.find()
  const entries: Post[] = response?.[0] || []
  return entries.filter((post) => post.post_type === 'Classics')
}

export default async function ClassicsPage() {
  const posts = await getClassics()

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Classics</h1>
      {posts.map((post) => (
        <div key={post.uid} className="mb-8 p-6 border rounded-lg shadow">
          <h2 className="text-2xl font-semibold">{post.title}</h2>
          <p className="text-gray-500 text-sm">By {post.author}</p>
        </div>
      ))}
    </div>
  )
}
