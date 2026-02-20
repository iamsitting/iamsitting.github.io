import { generateSitemap } from '../lib/sitemap';

export async function loader() {
  const baseUrl = 'https://iamsitting.com';
  const sitemap = await generateSitemap(baseUrl);
  
  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
} 