export async function GET() {
  const robots = `User-agent: *
Allow: /

# Sitemap
Sitemap: https://luxwebstudio.dev/sitemap.xml

# Allow all search engines to crawl the site
# Block access to admin or sensitive areas (none currently)

# Common crawl delays
Crawl-delay: 1`

  return new Response(robots, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
    },
  })
}