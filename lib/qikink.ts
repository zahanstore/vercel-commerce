// lib/qikink.ts
import { Product } from './types';

export async function getQikinkProducts(): Promise<Product[]> {
  try {
    const res = await fetch('https://api.qikink.com/v1/products', {
      headers: {
        'Authorization': `Bearer ${process.env.QIKINK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 } 
    });

    // Guard 1: Check if the HTTP request actually worked
    if (!res.ok) {
      console.error(`Qikink API error: ${res.status} ${res.statusText}`);
      return [];
    }

    const data = await res.json();

    // Guard 2: Ensure data.products is an array before calling .map()
    if (!data || !Array.isArray(data.products)) {
      console.error('Qikink API returned unexpected format:', data);
      return [];
    }

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
        url: p.image_url || '', // Fallback for missing images
        altText: p.name,
        width: 1000,
        height: 1000
      },
      images: p.image_url ? [{ url: p.image_url, altText: p.name, width: 1000, height: 1000 }] : [],
      variants: [],
      updatedAt: new Date().toISOString()
    }));
  } catch (error) {
    // Guard 3: Catch network failures so the whole build doesn't crash
    console.error('Failed to fetch Qikink products:', error);
    return [];
  }
}

