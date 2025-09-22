import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '/blog/classics';
    
    revalidatePath(page);
    
    if (page.startsWith('/blog/')) {
      revalidatePath('/');
    }
    
    const response = NextResponse.json({
      revalidated: true,
      page,
      timestamp: Date.now()
    });
    
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('CF-Cache-Control', 'no-cache');
    response.headers.set('CDN-Cache-Control', 'no-cache');
    
    return response;
    
  } catch {
    return NextResponse.json(
      { error: 'Revalidation failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    endpoint: 'Cache revalidation API'
  });
}