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
  "27.107.90.206",  // Office IP
  "45.115.187.118"  // Home IP
];

// Geo-Location and Locale Detection functions
function getGeoLocation(request) {
  const geoInfo = {
    country: request.headers.get('CF-IPCountry') || request.headers.get('x-country-code') || 'Unknown',
    region: request.headers.get('CF-Region') || request.headers.get('x-region') || 'Unknown',
    city: request.headers.get('CF-City') || request.headers.get('x-city') || 'Unknown'
  };
  
  return geoInfo;
}

function detectLocale(request, geoInfo) {
  // Get Accept-Language header
  const acceptLanguage = request.headers.get('Accept-Language') || '';
  
  // Parse Accept-Language header
  const languages = acceptLanguage
    .split(',')
    .map(lang => {
      const [code, qValue] = lang.trim().split(';q=');
      return {
        code: code.trim(),
        quality: qValue ? parseFloat(qValue) : 1.0
      };
    })
    .sort((a, b) => b.quality - a.quality);
  
  // Simplified country-based locale mapping (only English, French, Japanese)
  const countryLocaleMap = {
    'US': 'en-US',
    'GB': 'en-US',
    'CA': 'en-US',
    'AU': 'en-US',
    'FR': 'fr-FR',
    'BE': 'fr-FR',
    'CH': 'fr-FR',
    'JP': 'ja-JP'
  };
  
  // Get preferred locale from country
  const countryLocale = countryLocaleMap[geoInfo.country] || 'en-US';
  
  // Get preferred locale from Accept-Language (only English, French, Japanese)
  const supportedLanguages = ['en', 'fr', 'ja'];
  const browserLocale = languages.find(lang => 
    supportedLanguages.includes(lang.code.split('-')[0])
  )?.code || 'en-US';
  
  // Determine final locale
  let finalLocale = 'en-US'; // Default fallback
  
  if (languages.length > 0) {
    // Check if browser language matches country locale
    const countryLang = countryLocale.split('-')[0];
    const browserLang = browserLocale.split('-')[0];
    
    if (countryLang === browserLang) {
      finalLocale = countryLocale;
    } else {
      finalLocale = browserLocale;
    }
  } else {
    finalLocale = countryLocale;
  }
  
  return {
    locale: finalLocale,
    language: finalLocale.split('-')[0],
    country: finalLocale.split('-')[1] || geoInfo.country,
    browserLanguages: languages,
    countryLocale: countryLocale
  };
}

function getDeviceInfo(request) {
  const userAgent = request.headers.get('User-Agent') || '';
  
  // Device detection
  const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isTablet = /iPad|Android.*Tablet|Windows.*Touch/i.test(userAgent);
  const isDesktop = !isMobile && !isTablet;
  
  // Browser detection
  const isChrome = /Chrome/i.test(userAgent) && !/Edge|Edg/i.test(userAgent);
  const isFirefox = /Firefox/i.test(userAgent);
  const isSafari = /Safari/i.test(userAgent) && !/Chrome/i.test(userAgent);
  const isEdge = /Edge|Edg/i.test(userAgent);
  
  // OS detection
  const isWindows = /Windows/i.test(userAgent);
  const isMac = /Macintosh|Mac OS X/i.test(userAgent);
  const isLinux = /Linux/i.test(userAgent);
  const isAndroid = /Android/i.test(userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    browser: {
      isChrome,
      isFirefox,
      isSafari,
      isEdge,
      name: isChrome ? 'Chrome' : isFirefox ? 'Firefox' : isSafari ? 'Safari' : isEdge ? 'Edge' : 'Unknown'
    },
    os: {
      isWindows,
      isMac,
      isLinux,
      isAndroid,
      isIOS,
      name: isWindows ? 'Windows' : isMac ? 'macOS' : isLinux ? 'Linux' : isAndroid ? 'Android' : isIOS ? 'iOS' : 'Unknown'
    },
    userAgent
  };
}

export default async function handler(request, context) {
  const url = new URL(request.url);
  const hostname = url.hostname;
  const pathname = url.pathname;
  const searchParams = url.searchParams;
  
  // Get Geo-Location information
  const geoInfo = getGeoLocation(request);
  
  // Detect locale
  const localeInfo = detectLocale(request, geoInfo);
  
  // Get device information
  const deviceInfo = getDeviceInfo(request);
  
  // Log geo and locale information
  console.log('Geo-Location Info:', geoInfo);
  console.log('Locale Info:', localeInfo);
  console.log('Device Info:', deviceInfo);

  // Add geo and locale headers to the request for downstream processing
  const modifiedRequest = new Request(request, {
    headers: {
      ...Object.fromEntries(request.headers.entries()),
      'X-Geo-Country': geoInfo.country,
      'X-Geo-Region': geoInfo.region,
      'X-Geo-City': geoInfo.city,
      'X-Locale': localeInfo.locale,
      'X-Language': localeInfo.language
    }
  });

  // Geo-based content routing (example: redirect to localized versions)
  if (pathname === '/' || pathname === '/blog') {
    // Redirect to localized content based on geo-location
    const localizedPaths = {
      'FR': '/fr/blog',
      'JP': '/ja/blog'
    };
    
    const localizedPath = localizedPaths[geoInfo.country];
    if (localizedPath) {
      console.log(`Redirecting to localized content: ${localizedPath}`);
      return new Response(null, {
        status: 302,
        headers: {
          'Location': localizedPath,
          'Cache-Control': 'no-cache'
        }
      });
    }
  }

  // Device-specific optimizations
  if (deviceInfo.isMobile && pathname.startsWith('/blog/')) {
    // Add mobile-specific query parameters for mobile optimization
    const mobileUrl = new URL(request.url);
    mobileUrl.searchParams.set('mobile', 'true');
    mobileUrl.searchParams.set('device', 'mobile');
    
    // For mobile devices, you might want to serve optimized content
    console.log('Mobile device detected, serving mobile-optimized content');
  }


  // Debug endpoint for geo-location and locale information
  if (pathname === '/debug/geo') {
    return new Response(JSON.stringify({
      geo: geoInfo,
      locale: localeInfo,
      device: deviceInfo,
      headers: Object.fromEntries(request.headers.entries()),
      timestamp: new Date().toISOString()
    }, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }

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

  const rewriteResponse = await processRewrites(rewrites, modifiedRequest);
  if (rewriteResponse) return rewriteResponse;

  return fetch(modifiedRequest);
}