import * as contentstack from "contentstack";


console.log('Environment variables check:');
console.log('API_KEY exists:', !!process.env.CONTENTSTACK_API_KEY);
console.log('DELIVERY_TOKEN exists:', !!process.env.CONTENTSTACK_DELIVERY_TOKEN);
console.log('ENVIRONMENT exists:', !!process.env.CONTENTSTACK_ENVIRONMENT);

const stack = contentstack.Stack({
  api_key: process.env.CONTENTSTACK_API_KEY as string,
  delivery_token: process.env.CONTENTSTACK_DELIVERY_TOKEN as string,
  environment: process.env.CONTENTSTACK_ENVIRONMENT as string, 
});

export default stack;
