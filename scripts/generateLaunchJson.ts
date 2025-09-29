import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { Stack } from "./lib/contentstack-server";

dotenv.config({ path: path.join(process.cwd(), "apps/blog/.env") });

console.log(" Starting launch.json generation...");

async function fetchEntries(contentType: string) {
  const query = Stack.ContentType(contentType).Query().toJSON();
  const result = await query.find();
  return result[0];
}

async function generateLaunchJson() {
  try {
    const newspost = await fetchEntries("news_post");

    const launchJson: any = {};

    const cacheUrls: string[] = [];

    for (const news_post of newspost) {
      const cachePrimingUrls = newspost.cache?.cachepriming?.urls;

      if (
        cachePrimingUrls &&
        Array.isArray(cachePrimingUrls) &&
        cachePrimingUrls.length > 0
      ) {
        const validUrls = cachePrimingUrls.filter(
          (url: string) => typeof url === "string" && url.trim().length > 0
        );

        if (validUrls.length > 0) {
          console.log(
            `Found cache priming URLs in blog post: "${news_post.title}"`
          );
          cacheUrls.push(...validUrls);
        }
      }
    }

    if (cacheUrls.length > 0) {
      const uniqueCacheUrls = Array.from(new Set(cacheUrls)).sort();

      launchJson.cache = {
        cachePriming: {
          urls: uniqueCacheUrls,
        },
      };
    }

    const filePath = path.join(process.cwd(), "launch.json");
    fs.writeFileSync(filePath, JSON.stringify(launchJson, null, 2));

    console.log(
      "launch.json generated:\n",
      JSON.stringify(launchJson, null, 2)
    );
  } catch (error) {
    console.error("Error generating launch.json:", error);
    process.exit(1);
  }
}

generateLaunchJson();