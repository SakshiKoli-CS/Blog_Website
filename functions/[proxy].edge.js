export default async function handler(request, context) {
  const url = new URL(request.url);
  const hostname = url.hostname;

  console.log("Hostname:", hostname);

  // Password protection for preview domain only
  if (hostname.includes("blogwebsite-preview.devcontentstackapps.com")) {
    console.log("Preview domain detected - checking authentication");

    const validUsername = context.env?.PREVIEW_USERNAME;
    const validPassword = context.env?.PREVIEW_PASSWORD;
    
    // COMPREHENSIVE DEBUG
    console.log("=== ENVIRONMENT DEBUG ===");
    console.log("Has PREVIEW_USERNAME:", !!validUsername);
    console.log("Has PREVIEW_PASSWORD:", !!validPassword);
    console.log("Expected username:", validUsername || "NOT SET");
    console.log("Expected password:", validPassword || "NOT SET");
    console.log("Available env keys:", Object.keys(context.env || {}));
    
    const authHeader = request.headers.get("authorization");
    console.log("Auth header present:", !!authHeader);

    if (authHeader && authHeader.startsWith("Basic ")) {
      try {
        const credentials = atob(authHeader.slice(6));
        const [username, password] = credentials.split(":");

        console.log("=== RECEIVED CREDENTIALS ===");
        console.log("Received username:", `"${username}"`);
        console.log("Received password:", `"${password}"`);
        console.log("Username length:", username.length);
        console.log("Password length:", password.length);
        
        console.log("=== COMPARISON ===");
        console.log("Username match:", username === validUsername);
        console.log("Password match:", password === validPassword);

        if (username === validUsername && password === validPassword) {
          console.log("✅ Authentication successful");
          
        } else {
          console.log("❌ Authentication failed");
          
          // Force credential re-prompt with stronger cache busting
          return new Response("Unauthorized - Please check your credentials", {
            status: 401,
            headers: {
              "WWW-Authenticate": `Basic realm="Preview-${Date.now()}-${Math.random()}"`,
              "Content-Type": "text/plain",
              "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
              "Pragma": "no-cache",
              "Expires": "-1",
              "Clear-Site-Data": '"cache", "storage"',
            },
          });
        }
      } catch (error) {
        console.log("❌ Error parsing credentials:", error);
        return new Response("Authentication Error", {
          status: 401,
          headers: {
            "WWW-Authenticate": `Basic realm="Preview-${Date.now()}-${Math.random()}"`,
            "Content-Type": "text/plain",
            "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
            "Pragma": "no-cache", 
            "Expires": "-1",
          },
        });
      }
    } else {
      console.log("No auth header - showing login prompt");
      return new Response("Authentication Required", {
        status: 401,
        headers: {
          "WWW-Authenticate": `Basic realm="Preview-${Date.now()}-${Math.random()}"`,
          "Content-Type": "text/plain",
          "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
          "Pragma": "no-cache",
          "Expires": "-1",
        },
      });
    }
  } else {
    console.log("Not a preview domain - skipping password protection");
  }

  return fetch(request);
}