import { MOCK_PROPERTIES } from '@/lib/mock-data';
import { PropertyClient } from './PropertyClient';
import { notFound } from 'next/navigation';

// Обязательная функция для статического билда
export function generateStaticParams() {
  return MOCK_PROPERTIES.map((property) => ({
    id: property.id,
  }));
}

interface PropertyPageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const resolvedParams = await params;
  const property = MOCK_PROPERTIES.find((p) => p.id === resolvedParams.id);

  if (!property) {
    notFound();
  }

  return <PropertyClient property={property} />;
}