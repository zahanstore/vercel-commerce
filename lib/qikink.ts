// lib/qikink.ts
import { Product } from './types';

export async function getQikinkProducts(): Promise<Product[]> {
  const res = await fetch('https://api.qikink.com/v1/products', {
    headers: {
      'Authorization': `Bearer ${process.env.QIKINK_API_KEY}`,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 3600 } 
  });

  const data = await res.json();

  // Mapping Qikink fields to Vercel Commerce fields
  return data.products.map((p: any) => ({
    id: p.id.toString(),
    handle: p.slug || p.id.toString(),
    availableForSale: true,
    title: p.name,
    description: p.description || '',
    descriptionHtml: p.description || '',
    options: [],
    priceRange: {
      maxVariantPrice: { amount: p.price.toString(), currencyCode: 'INR' },
      minVariantPrice: { amount: p.price.toString(), currencyCode: 'INR' }
    },
    featuredImage: {
      url: p.image_url,
      altText: p.name,
      width: 1000,
      height: 1000
    },
    images: [{ url: p.image_url, altText: p.name, width: 1000, height: 1000 }],
    variants: [],
    updatedAt: new Date().toISOString()
  }));
}
