import * as contentstack from "contentstack";

export const Stack = contentstack.Stack({
  api_key: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY!,
  delivery_token: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN!,
  environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT!,
  host: process.env.NEXT_PUBLIC_CONTENTSTACK_API_HOST || undefined,
} as any);


if (process.env.NEXT_PUBLIC_CONTENTSTACK_API_HOST) {
  Stack.config.host = process.env.NEXT_PUBLIC_CONTENTSTACK_API_HOST;
} 


export async function getHealthcarePost() {
  try {
    const Query = Stack.ContentType('news_post').Query();
    Query.where("url", "/news/ai-healthcare").language("en-us");
    const response = await Query.toJSON().find();
    return response?.[0]?.[0] || null;
  } catch (error) {
    console.error('Error fetching healthcare post:', error);
    return null;
  }
}

export async function getCachePrimePost() {
  try {
    const Query = Stack.ContentType('news_post').Query();
    Query.where("url", "/blog/cacheprime").language("en-us");
    const response = await Query.toJSON().find();
    return response?.[0]?.[0] || null;
  } catch (error) {
    console.error('Error fetching cacheprime post:', error);
    return null;
  }
}

export async function getFinancePost() {
  try {
    const Query = Stack.ContentType('news_post').Query();
    Query.where("url", "/news/ai-finance").language("en-us");
    const response = await Query.toJSON().find();
    return response?.[0]?.[0] || null;
  } catch (error) {
    console.error('Error fetching finance post:', error);
    return null;
  }
}

export async function getClimatePost() {
  try {
    const Query = Stack.ContentType('news_post').Query();
    Query.where("url", "/news/ai-climate").language("en-us");
    const response = await Query.toJSON().find();
    return response?.[0]?.[0] || null;
  } catch (error) {
    console.error('Error fetching climate post:', error);
    return null;
  }
}
