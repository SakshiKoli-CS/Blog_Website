import * as contentstack from "contentstack";
// import ContentstackLivePreview from "@contentstack/live-preview-utils";

export const Stack = contentstack.Stack({
  api_key: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY!,
  delivery_token: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN!,
  environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT!,
  // Uncomment the live_preview section below if you want live preview functionality
  // live_preview: {
  //   enable: true,
  //   management_token: process.env.NEXT_PUBLIC_CONTENTSTACK_MANAGEMENT_TOKEN!,
  //   host: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW_HOST!,
  // },
});

// Uncomment if you want to set a custom host
// if (process.env.NEXT_PUBLIC_CONTENTSTACK_LIVE_PREVIEW_HOST) {
//   Stack.setHost(process.env.NEXT_PUBLIC_CONTENTSTACK_LIVE_PREVIEW_HOST!);
// }

// Uncomment to initialize live preview
// ContentstackLivePreview.init({
//   enable: true,
//   stackSdk: Stack,
//   ssr: true,
//   clientUrlParams: {
//     host: process.env.NEXT_PUBLIC_CONTENTSTACK_APP_HOST!,
//   },
// });

// Simple functions that return raw Contentstack data
// Let the pages handle their own typing
export async function getClassicsPosts() {
  try {
    const Query = Stack.ContentType('news_post').Query()
    Query.toJSON()
    const response = await Query.find()
    const entries = response?.[0] || []
    return entries.filter((post: any) => post.post_type === 'Classics')
  } catch (error) {
    console.error('Error fetching classics:', error)
    return []
  }
}

export async function getLivePosts() {
  try {
    const Query = Stack.ContentType('news_post').Query()
    Query.toJSON()
    const response = await Query.find()
    const entries = response?.[0] || []
    return entries.filter((post: any) => post.post_type === 'Live')
  } catch (error) {
    console.error('Error fetching live posts:', error)
    return []
  }
}

export async function getUpdatesPosts() {
  try {
    const Query = Stack.ContentType('news_post').Query()
    Query.toJSON()
    const response = await Query.find()
    const entries = response?.[0] || []
    return entries.filter((post: any) => post.post_type === 'Updates')
  } catch (error) {
    console.error('Error fetching updates:', error)
    return []
  }
}