export async function processRewrites(rewrites, request) {
  const url = new URL(request.url);

  for (const rule of rewrites) {
    if (rule.onlyOnProd) {
      if (url.hostname !== "blogwebsite.devcontentstackapps.com") {
        continue;
      }
    }

    if (rule.onlyOnPreview) {
      if (
        url.hostname !== "preview-blog.devcontentstackapps.com" &&
        url.hostname !== "blog-test.devcontentstackapps.com"
      ) {
        continue;
      }
    }

    if (url.pathname === rule.source) {
      const rewrittenUrl = `${url.origin}${rule.destination}`;
      
      const rewriteRequest = new Request(rewrittenUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body,
      });
      
      const response = await fetch(rewriteRequest);
      
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
    }
  }

  return null;
}
