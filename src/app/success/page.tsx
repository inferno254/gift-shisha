import SuccessClient from './SuccessClient';

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ order?: string; method?: string }> }) {
  const params = await searchParams;
  return <SuccessClient order={params.order || ''} method={params.method || ''} />;
}
