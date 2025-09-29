import { processRewrites } from '../apps/blog/src/app/lib/rewrite.js';

// Simple JWT functions
function base64UrlDecode(str) {
  str += new Array(5 - (str.length % 4)).join("=");
  return atob(str.replace(/-/g, "+").replace(/_/g, "/"));
}

function parseJWT(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));

    return { header, payload };
  } catch (e) {
    return null;
  }
}

function verifyJWT(token, secret) {
  try {
    const sessionData = JSON.parse(atob(token));

    if (sessionData.exp && Date.now() >= sessionData.exp * 1000) {
      return false;
    }

    if (!sessionData.access_token) {
      return false;
    }

    return true;
  } catch (e) {
    return false;
  }
}

const ALLOWED_IPS = [
  "27.107.90.206"
];

export default async function handler(request, context) {
  const url = new URL(request.url);
  const hostname = url.hostname;
  const pathname = url.pathname;
  const searchParams = url.searchParams;

  // IP restriction and OAuth SSO for author tools only
  if (pathname.startsWith("/author-tools")) {
    const clientIP = request.headers.get("CF-Connecting-IP") ||
                     request.headers.get("x-forwarded-for") ||
                     request.headers.get("x-real-ip") ||
                     "127.0.0.1";

    if (!ALLOWED_IPS.includes(clientIP.split(',')[0].trim())) {
      console.log("Blocked IP:", clientIP, "from accessing author-tools");
      return new Response("Access Denied: Author Tools - IP not allowed", {
        status: 403,
        headers: { "Content-Type": "text/plain" },
      });
    }

    const jwt = request.headers
      .get("Cookie")
      ?.split(";")
      .find((c) => c.trim().startsWith("jwt="))
      ?.split("=")[1];

    const clientSecret = context.env?.OAUTH_CLIENT_SECRET;
    const isValidJWT = jwt && verifyJWT(jwt, clientSecret);

    if (!jwt || !isValidJWT) {
      const loginUrl = new URL("/login", request.url);
      return Response.redirect(loginUrl.toString(), 302);
    }

    console.log("Author tools access granted - IP and SSO verified");
  }

  if (pathname === "/oauth/callback") {
    const code = searchParams.get("code");
    if (!code) {
      return new Response("Authorization code not found", { status: 400 });
    }

    try {
      const tokenUrl = context.env?.OAUTH_TOKEN_URL;
      const clientId = context.env?.OAUTH_CLIENT_ID;
      const clientSecret = context.env?.OAUTH_CLIENT_SECRET;
      const redirectUri = context.env?.OAUTH_REDIRECT_URI;

      const tokenResponse = await fetch(tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          code: code,
        }),
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error("Token exchange failed:", errorText);
        throw new Error(`Token exchange failed: ${tokenResponse.status} - ${errorText}`);
      }

      const tokenData = await tokenResponse.json();

      const sessionData = {
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        exp: Math.floor(Date.now() / 1000) + (tokenData.expires_in || 3600),
      };

      const sessionToken = btoa(JSON.stringify(sessionData));

      const redirectUrl = new URL("/author-tools", request.url).toString();

      return new Response(null, {
        status: 302,
        headers: {
          Location: redirectUrl,
          "Set-Cookie": `jwt=${sessionToken}; Path=/; Max-Age=${tokenData.expires_in || 3600}; SameSite=Lax; HttpOnly; Secure`,
        },
      });
    } catch (error) {
      console.error("OAuth callback error:", error);
      return new Response("Authentication failed", { status: 500 });
    }
  }

  if (pathname === "/logout") {
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/login",
        "Set-Cookie": "jwt=; Path=/; Max-Age=0; SameSite=Lax; HttpOnly; Secure",
      },
    });
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
  const rewrites = [
    {
      source: "/latest",
      destination: "/blog/latest",
      onlyOnProd: true,
    },
    {
      source: "/blog",
      destination: "/blog/latest",
      onlyOnProd: true,
    },
    {
      source: "/blog",
      destination: "/404",
      onlyOnPreview: true,
    },
  ];

  const rewriteResponse = await processRewrites(rewrites, request);
  if (rewriteResponse) return rewriteResponse;

  return fetch(request);
}