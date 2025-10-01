export default async function handler(request, response) {
  try {
    // Basic validation
    if (request.method !== 'GET') {
      return response.status(405).json({ 
        error: 'Method not allowed',
        allowedMethods: ['GET']
      });
    }

    const { asset } = request.params;
    
    if (!asset || typeof asset !== 'string') {
      return response.status(400).json({ 
        error: 'Invalid asset parameter',
        message: 'Asset parameter is required and must be a string'
      });
    }

    // Security check
    if (asset.includes('..') || asset.includes('/') || asset.includes('\\')) {
      return response.status(400).json({ 
        error: 'Invalid asset path',
        message: 'Asset path contains invalid characters'
      });
    }

    // Build the Contentstack Image API URL
    const baseImageUrl = `https://dev11-images.csnonprod.com/v3/assets/bltb07679cca4bcd589/blt37b0ee82b03f0162/${asset}`;
    
    // Simple fetch without complex error handling
    const imageResponse = await fetch(baseImageUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Contentstack-Asset-Proxy/1.0',
      },
    });
    
    if (!imageResponse.ok) {
      return response.status(404).json({ 
        error: 'Asset not found',
        requestedAsset: asset,
        status: imageResponse.status
      });
    }
    
    // Get the image data
    const imageBuffer = await imageResponse.arrayBuffer();
    
    // Return the image
    return response.status(200)
      .setHeader('Content-Type', imageResponse.headers.get('content-type') || 'image/png')
      .setHeader('Cache-Control', 'public, max-age=31536000, immutable')
      .send(Buffer.from(imageBuffer));
      
  } catch (error) {
    return response.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    });
  }
}