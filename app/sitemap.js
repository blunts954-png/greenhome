import { PRODUCTS } from '@/lib/products';

export default async function sitemap() {
  const baseUrl = 'https://homegrownmoney.com';

  const productUrls = PRODUCTS.map((product) => ({
    url: `${baseUrl}/shop/${product.slug}`,
    lastModified: new Date(),
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
    },
    ...productUrls,
  ];
}
