import * as contentstack from "contentstack";

const stack = contentstack.Stack({
  api_key: process.env.CONTENTSTACK_API_KEY as string,
  delivery_token: process.env.CONTENTSTACK_DELIVERY_TOKEN as string,
  environment: process.env.CONTENTSTACK_ENVIRONMENT as string, 
});

export default stack;
