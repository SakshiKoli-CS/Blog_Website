const ALLOWED_IPS = [
  "27.107.90.206"
];

export default async function handler(request, context) {
  const url = new URL(request.url);
  const hostname = url.hostname;
  const pathname = url.pathname;

  // IP-based access control for author tools
  if (pathname.startsWith("/author-tools")) {
    let clientIP = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   '127.0.0.1';
    
    if (clientIP.includes(',')) {
      clientIP = clientIP.split(',')[0].trim();
    }

    if (!ALLOWED_IPS.includes(clientIP)) {
      console.log("Blocked IP:", clientIP, "from accessing author-tools");
      return new Response("Access Denied: Author Tools - IP not allowed", {
        status: 403,
        headers: { "Content-Type": "text/plain" },
      });
    }
  }

  // Single redirect (works on ALL domains)
  if (pathname === "/blog/neuralink") {
    return new Response(null, {
      status: 302,
      headers: {
        "Location": "/blog/classics",
        "Cache-Control": "no-cache"
      }
    });
  }


  // Password protection for preview domain only
  if (hostname.includes("blogwebsite-preview.devcontentstackapps.com")) {
    const validUsername = context.env?.PREVIEW_USERNAME;
    const validPassword = context.env?.PREVIEW_PASSWORD;
    const authHeader = request.headers.get("authorization");

    if (authHeader && authHeader.startsWith("Basic ")) {
      try {
        const credentials = atob(authHeader.slice(6));
        const [username, password] = credentials.split(":");

        if (username === validUsername && password === validPassword) {
          
        } else {
          return new Response("Unauthorized", {
            status: 401,
            headers: {
              "WWW-Authenticate": `Basic realm="Preview Access ${Date.now()}"`,
              "Content-Type": "text/plain",
              "Cache-Control": "no-cache, no-store, must-revalidate",
              "Pragma": "no-cache",
              "Expires": "0",
            },
          });
        }
      } catch (error) {
        return new Response("Unauthorized", {
          status: 401,
          headers: {
            "WWW-Authenticate": `Basic realm="Preview Access ${Date.now()}"`,
            "Content-Type": "text/plain",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0",
          },
        });
      }
    } else {
      return new Response("Unauthorized", {
        status: 401,
        headers: {
          "WWW-Authenticate": `Basic realm="Preview Access ${Date.now()}"`,
          "Content-Type": "text/plain",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      });
    }
  }

  // URL Rewrites
  if (pathname === "/latest") {
 
    if (hostname === "blogwebsite.devcontentstackapps.com") {
      const rewriteUrl = new URL("/blog?page=1", url.origin);
      return fetch(new Request(rewriteUrl.href, request));
    }
  }

  return fetch(request);
}