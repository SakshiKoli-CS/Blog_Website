import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '/blog/classics';
    
    console.log(` Revalidating: ${page}`);
    
    revalidatePath(page);
    
    if (page.startsWith('/blog/')) {
      revalidatePath('/');
    }
    
    console.log(' Cache cleared successfully');
    
    return NextResponse.json({
      revalidated: true,
      page,
      timestamp: Date.now()
    });
    
  } catch (error) {
    console.error(' Revalidation failed:', error);
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