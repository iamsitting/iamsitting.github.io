import { generateSitemap } from '../lib/sitemap';

export async function loader() {
  const baseUrl = 'https://devoted.dev';
  const sitemap = await generateSitemap(baseUrl);
  
  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
} 