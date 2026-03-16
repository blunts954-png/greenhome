export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/',
    },
    sitemap: 'https://homegrownmoney.vercel.app/sitemap.xml',
  }
}
