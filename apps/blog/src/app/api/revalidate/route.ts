import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    console.log(' Revalidation API called via Contentstack Automate');
    
    const { path, page } = await request.json();
    const targetPath = path || page || '/blog/classics';
    
    console.log(` Revalidating path: ${targetPath}`);
    
    revalidatePath(targetPath);
    
    if (targetPath.startsWith('/blog/')) {
      revalidatePath('/');
      console.log(' Also revalidated homepage');
    }
    
    console.log(' Cache revalidation completed');
    
    return NextResponse.json({
      success: true,
      message: `Cache revalidated for ${targetPath}`,
      timestamp: new Date().toISOString(),
      revalidated: [targetPath, ...(targetPath.startsWith('/blog/') ? ['/'] : [])]
    });
    
  } catch (error) {
    console.error(' Revalidation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Cache revalidation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}


export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    endpoint: 'Cache revalidation API',
    timestamp: new Date().toISOString()
  });
}
