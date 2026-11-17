import ShopClient from './ShopClient';

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const params = await searchParams;
  return <ShopClient initialCategory={params.category || 'all'} />;
}
