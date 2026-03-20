import { notFound } from 'next/navigation';
import { getProductBySlug, PRODUCTS } from '@/lib/products';
import ProductDetailClient from './ProductDetailClient';

export async function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    return {
      title: 'Product Not Found | Home Grown Money'
    };
  }

  const fulfillmentCopy = product.pickupOnly
    ? 'Available for Bakersfield pickup or local delivery only.'
    : 'Available for nationwide apparel shipping or local pickup.';

  return {
    title: `${product.name} | Home Grown Money`,
    description: `${product.description} ${fulfillmentCopy}`,
    alternates: {
      canonical: `/shop/${product.slug}`
    },
    openGraph: {
      title: `${product.name} | Home Grown Money`,
      description: `${product.description} ${fulfillmentCopy}`,
      url: `https://homegrownmoney.com/shop/${product.slug}`,
      images: [
        {
          url: product.image,
          width: 1200,
          height: 1200,
          alt: product.name
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | Home Grown Money`,
      description: `${product.description} ${fulfillmentCopy}`,
      images: [product.image]
    }
  };
}

export default function ProductDetailPage({ params }) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
