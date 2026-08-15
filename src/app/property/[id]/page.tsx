import React from 'react';
import { MOCK_PROPERTIES } from '@/lib/mock-data';
import { PropertyClient } from './PropertyClient';

// Обязательно для сборки статики на GitHub Pages:
export async function generateStaticParams() {
  return MOCK_PROPERTIES.map((p) => ({
    id: p.id,
  }));
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const property =
    MOCK_PROPERTIES.find((p) => p.id === resolvedParams.id) || MOCK_PROPERTIES[0];

  return <PropertyClient property={property} />;
}