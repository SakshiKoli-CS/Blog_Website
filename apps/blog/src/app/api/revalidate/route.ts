import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    console.log(' API Route Called! URL:', request.url);
    
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '/blog/classics';
    
    console.log(` Page parameter received: "${page}"`);
    console.log(` Starting revalidation for: ${page}`);
    
    revalidatePath(page);
    console.log(` revalidatePath("${page}") completed`);
    
    if (page.startsWith('/blog/')) {
      revalidatePath('/');
      console.log(` revalidatePath("/") also completed`);
    }
    
    const response = {
      revalidated: true,
      page,
      timestamp: Date.now(),
      success: 'Cache cleared successfully'
    };
    
    console.log(' Sending response:', response);
    
    const nextResponse = NextResponse.json(response);
    
    nextResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    nextResponse.headers.set('Pragma', 'no-cache');
    nextResponse.headers.set('Expires', '0');
    nextResponse.headers.set('X-Cache-Clear', 'true');
    
   
    nextResponse.headers.set('CF-Cache-Control', 'no-cache');
    nextResponse.headers.set('CDN-Cache-Control', 'no-cache');
    
    return nextResponse;
    
  } catch (error) {
    console.error(' Revalidation failed:', error);
    return NextResponse.json(
      { 
        error: 'Revalidation failed', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
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