export default async function handler(request, response) {
  try {
    // Validate request method
    if (request.method !== 'GET') {
      return response.status(405).json({ 
        error: 'Method not allowed',
        allowedMethods: ['GET']
      });
    }

    const { asset } = request.params;
    
    // Validate asset parameter
    if (!asset || typeof asset !== 'string') {
      return response.status(400).json({ 
        error: 'Invalid asset parameter',
        message: 'Asset parameter is required and must be a string'
      });
    }

    // Security: Basic path traversal protection
    if (asset.includes('..') || asset.includes('/') || asset.includes('\\')) {
      return response.status(400).json({ 
        error: 'Invalid asset path',
        message: 'Asset path contains invalid characters'
      });
    }

    const url = new URL(request.url);
    const queryParams = url.searchParams;
    
    // Get the original asset path from the request
    const originalAssetPath = `/assets/${asset}`;
    
    // Build the Contentstack Image API URL
    // Using the provided image URL structure: https://dev11-images.csnonprod.com/v3/assets/...
    const baseImageUrl = `https://dev11-images.csnonprod.com/v3/assets/bltb07679cca4bcd589/blt37b0ee82b03f0162/${asset}`;
    
    // Check if this is an image file that can be optimized
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const isImage = imageExtensions.some(ext => asset.toLowerCase().endsWith(ext));
    
    // Set common headers
    const commonHeaders = {
      'User-Agent': 'Contentstack-Asset-Proxy/1.0',
      'Accept': isImage ? 'image/*' : '*/*',
    };

    if (isImage) {
      // Use Contentstack Image API for optimization
      let optimizedUrl = baseImageUrl;
      
      // Add optimization parameters from query string
      const width = queryParams.get('w') || queryParams.get('width');
      const height = queryParams.get('h') || queryParams.get('height');
      const quality = queryParams.get('q') || queryParams.get('quality') || 'auto';
      const format = queryParams.get('f') || queryParams.get('format') || 'auto';
      
      // Validate numeric parameters
      if (width && (isNaN(parseInt(width)) || parseInt(width) <= 0)) {
        return response.status(400).json({ 
          error: 'Invalid width parameter',
          message: 'Width must be a positive number'
        });
      }
      
      if (height && (isNaN(parseInt(height)) || parseInt(height) <= 0)) {
        return response.status(400).json({ 
          error: 'Invalid height parameter',
          message: 'Height must be a positive number'
        });
      }
      
      // Build optimization parameters
      const optimizationParams = new URLSearchParams();
      
      if (width) optimizationParams.append('width', width);
      if (height) optimizationParams.append('height', height);
      if (quality && quality !== 'auto') optimizationParams.append('quality', quality);
      if (format && format !== 'auto') optimizationParams.append('format', format);
      
      // Add other Contentstack Image API parameters
      if (queryParams.get('fit')) optimizationParams.append('fit', queryParams.get('fit'));
      if (queryParams.get('crop')) optimizationParams.append('crop', queryParams.get('crop'));
      if (queryParams.get('gravity')) optimizationParams.append('gravity', queryParams.get('gravity'));
      
      // Append optimization parameters to the URL
      if (optimizationParams.toString()) {
        optimizedUrl += `?${optimizationParams.toString()}`;
      }
      
      try {
        // Fetch the optimized image with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const imageResponse = await fetch(optimizedUrl, {
          method: 'GET',
          headers: commonHeaders,
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!imageResponse.ok) {
          console.warn(`Optimized image fetch failed (${imageResponse.status}), trying fallback`);
          
          // If optimization fails, try to fetch the original image
          const fallbackController = new AbortController();
          const fallbackTimeoutId = setTimeout(() => fallbackController.abort(), 10000);
          
          const fallbackResponse = await fetch(baseImageUrl, {
            method: 'GET',
            headers: commonHeaders,
            signal: fallbackController.signal,
          });
          
          clearTimeout(fallbackTimeoutId);
          
          if (!fallbackResponse.ok) {
            return response.status(404).json({ 
              error: 'Asset not found',
              originalPath: originalAssetPath,
              requestedAsset: asset,
              optimizedUrl: optimizedUrl,
              fallbackUrl: baseImageUrl
            });
          }
          
          // Return the original image
          const imageBuffer = await fallbackResponse.arrayBuffer();
          return response.status(200)
            .setHeader('Content-Type', fallbackResponse.headers.get('content-type') || 'image/png')
            .setHeader('Cache-Control', 'public, max-age=31536000, immutable')
            .setHeader('X-Optimized', 'false')
            .setHeader('X-Fallback', 'true')
            .send(Buffer.from(imageBuffer));
        }
        
        // Return the optimized image
        const imageBuffer = await imageResponse.arrayBuffer();
        return response.status(200)
          .setHeader('Content-Type', imageResponse.headers.get('content-type') || 'image/png')
          .setHeader('Cache-Control', 'public, max-age=31536000, immutable')
          .setHeader('X-Optimized', 'true')
          .send(Buffer.from(imageBuffer));
          
      } catch (fetchError) {
        if (fetchError.name === 'AbortError') {
          return response.status(504).json({ 
            error: 'Request timeout',
            message: 'Asset fetch timed out'
          });
        }
        throw fetchError;
      }
        
    } else {
      // For non-image assets, proxy directly without optimization
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout for non-images
        
        const assetResponse = await fetch(baseImageUrl, {
          method: 'GET',
          headers: commonHeaders,
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!assetResponse.ok) {
          return response.status(404).json({ 
            error: 'Asset not found',
            originalPath: originalAssetPath,
            requestedAsset: asset,
            assetUrl: baseImageUrl
          });
        }
        
        // Return the asset
        const assetBuffer = await assetResponse.arrayBuffer();
        return response.status(200)
          .setHeader('Content-Type', assetResponse.headers.get('content-type') || 'application/octet-stream')
          .setHeader('Cache-Control', 'public, max-age=31536000, immutable')
          .send(Buffer.from(assetBuffer));
          
      } catch (fetchError) {
        if (fetchError.name === 'AbortError') {
          return response.status(504).json({ 
            error: 'Request timeout',
            message: 'Asset fetch timed out'
          });
        }
        throw fetchError;
      }
    }
    
  } catch (error) {
    console.error('Asset proxy error:', {
      error: error.message,
      stack: error.stack,
      asset: request.params?.asset,
      url: request.url
    });
    
    // Don't expose internal error details in production
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return response.status(500).json({ 
      error: 'Internal server error',
      message: isDevelopment ? error.message : 'An error occurred while processing the asset',
      ...(isDevelopment && { stack: error.stack })
    });
  }
}
