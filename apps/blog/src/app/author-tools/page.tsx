import Link from 'next/link';

export const revalidate = 86400;

export default function AuthorTools() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Author Tools</h1>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Quick Actions</h2>
        <ul>
          <li><button>Create New Post</button></li>
          <li><button>View Analytics</button></li>
          <li><button>Manage Users</button></li>
          <li><button>Settings</button></li>
        </ul>
      </div>

      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <p>Access granted</p>
      </div>

      <div style={{ marginTop: '20px' }}>
        <Link href="/">← Back to Home</Link>
      </div>
    </div>
  );
}
