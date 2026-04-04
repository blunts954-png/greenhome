export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/coaiadmin/', '/api/'],
      },
    ],
    sitemap: 'https://homegrownmoney.com/sitemap.xml',
  };
}
