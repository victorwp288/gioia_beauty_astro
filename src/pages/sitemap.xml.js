
export async function GET({ site }) {
  if (!site) {
    return new Response('Site configuration missing', { status: 500 })
  }

  
  // Combine static pages and dynamic blog posts
  const pages = [
    '',
    'about',
    'blog',
    // Add dynamic blog posts
  ]

  const sitemap = `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map(
      (page) => `
    <url>
      <loc>${new URL(page, site).href}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.7</priority>
    </url>`
    )
    .join('')}
</urlset>`.trim()

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
} 