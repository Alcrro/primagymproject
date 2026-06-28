import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/cos', '/api/'],
    },
    sitemap: 'https://apexfit.ro/sitemap.xml',
  };
}
