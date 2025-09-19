export default async function handler(request, context) {
  const url = new URL(request.url);
  const hostname = url.hostname;

  console.log("Hostname:", hostname);

  // Password protection for preview domain only
  if (hostname.includes("blogwebsite-preview.devcontentstackapps.com")) {
    console.log("Preview domain detected - checking authentication");

    const validUsername = context.env?.PREVIEW_USERNAME || "preview";
    const validPassword = context.env?.PREVIEW_PASSWORD || "preview123";
    const authHeader = request.headers.get("authorization");

    if (authHeader && authHeader.startsWith("Basic ")) {
      try {
        const credentials = atob(authHeader.slice(6));
        const [username, password] = credentials.split(":");

        if (username === validUsername && password === validPassword) {
          console.log("Authentication successful");
          
        } else {
          console.log("Invalid credentials - username or password incorrect");
          return new Response("Unauthorized - Invalid credentials", {
            status: 401,
            headers: {
              "WWW-Authenticate": `Basic realm="Preview Access - ${Date.now()}"`,
              "Content-Type": "text/plain",
              "Cache-Control": "no-cache, no-store, must-revalidate",
              "Pragma": "no-cache",
              "Expires": "0",
            },
          });
        }
      } catch (error) {
        console.log("Error parsing credentials:", error);
        return new Response("Authentication Error", {
          status: 401,
          headers: {
            "WWW-Authenticate": `Basic realm="Preview Access - ${Date.now()}"`,
            "Content-Type": "text/plain",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0",
          },
        });
      }
    } else {
      console.log("No auth header - returning 401");
      return new Response("Authentication Required", {
        status: 401,
        headers: {
          "WWW-Authenticate": `Basic realm="Preview Access - ${Date.now()}"`,
          "Content-Type": "text/plain",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      });
    }
  } else {
    console.log("Not a preview domain - skipping password protection");
  }

  return fetch(request);
}