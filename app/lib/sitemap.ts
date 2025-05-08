import { getAllPosts } from './api';

interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export async function generateSitemap(baseUrl: string): Promise<string> {
  const entries: SitemapEntry[] = [
    {
      url: baseUrl,
      changefreq: 'daily',
      priority: 1.0
    },
    {
      url: `${baseUrl}/blog`,
      changefreq: 'daily',
      priority: 0.9
    },
    {
      url: `${baseUrl}/about`,
      changefreq: 'monthly',
      priority: 0.8
    }
  ];

  // Add blog posts
  try {
    const { posts } = await getAllPosts(1);
    posts.forEach(post => {
      entries.push({
        url: `${baseUrl}/post/${post.slug}`,
        lastmod: post.publishedAt,
        changefreq: 'weekly',
        priority: 0.7
      });
    });
  } catch (error) {
    console.error('Error fetching posts for sitemap:', error);
  }

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${entries.map(entry => `
  <url>
    <loc>${entry.url}</loc>
    ${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ''}
    ${entry.changefreq ? `<changefreq>${entry.changefreq}</changefreq>` : ''}
    ${entry.priority ? `<priority>${entry.priority}</priority>` : ''}
  </url>`).join('')}
</urlset>`;

  return xml;
} 