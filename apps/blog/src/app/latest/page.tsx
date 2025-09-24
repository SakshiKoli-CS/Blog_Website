import Link from 'next/link';

export default function LatestPage() {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Latest Page</h1>
      <p>This is the actual /latest page content.</p>
      <p>You are seeing this because:</p>
      <ul>
        <li>You are on a non-production domain, OR</li>
        <li>The edge function rewrite is not working</li>
      </ul>
      
      <div style={{ marginTop: '20px' }}>
        <h3>What you should see on production:</h3>
        <p>On <strong>blogwebsite.devcontentstackapps.com</strong>, this page gets rewritten to show /blog?page=1 content instead.</p>
      </div>

      <div style={{ marginTop: '20px' }}>
        <Link href="/">Back to Home</Link>
      </div>
    </div>
  );
}
