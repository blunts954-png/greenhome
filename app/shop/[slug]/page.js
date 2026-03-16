import { PRODUCTS } from '@/lib/products';
import ProductDetailClient from './ProductDetailClient';

export async function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export default function ProductDetailPage({ params }) {
  const { slug } = params;
  return <ProductDetailClient slug={slug} />;
}
