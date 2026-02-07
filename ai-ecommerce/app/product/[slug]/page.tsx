import { notFound } from 'next/navigation';
import productsData from '@/data/products.json';
import categoriesData from '@/data/categories.json';
import type { Product, Category } from '@/lib/types';
import { ProductDetail } from './product-detail';

const products = productsData as unknown as Product[];
const categories = categoriesData as unknown as Category[];

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return {};
  return {
    title: `${product.name} — Nova`,
    description: `Buy ${product.name} at the best price. ${product.freeShipping ? 'Free shipping.' : ''}`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  const category = categories.find((c) => c.id === product.categoryId);
  const related = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  return <ProductDetail product={product} category={category ?? null} related={related} />;
}
