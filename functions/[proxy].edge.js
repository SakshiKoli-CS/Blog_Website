export default async function handler(request, context) {
  const url = new URL(request.url);
  const hostname = url.hostname;

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

  return fetch(request);
}