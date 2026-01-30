// lib/qikink.ts
import { Product } from './types';

export async function getQikinkProducts(): Promise<Product[]> {
  // CORRECT ENDPOINT: Qikink uses my_products for merchant-created items
  const endpoint = 'https://api.qikink.com/v1/my_products'; 

  try {
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.QIKINK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 } 
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Qikink API Error (${res.status}): ${errorText}`);
      return [];
    }

    const data = await res.json();

    // Qikink typically wraps results in a 'data' property
    const productsArray = data.data || data.products || [];

    if (!Array.isArray(productsArray)) {
      console.error('Qikink API response format unexpected. Received:', data);
      return [];
    }

    return productsArray.map((p: any) => ({
      id: p.id?.toString() || p.sku || Math.random().toString(),
      handle: p.slug || p.sku || p.id?.toString(),
      availableForSale: true,
      title: p.name || 'Qikink Product',
      description: p.description || '',
      descriptionHtml: p.description || '',
      options: [],
      priceRange: {
        maxVariantPrice: { amount: (p.selling_price || p.price || 0).toString(), currencyCode: 'INR' },
        minVariantPrice: { amount: (p.selling_price || p.price || 0).toString(), currencyCode: 'INR' }
      },
      featuredImage: {
        url: p.image_url || p.mockup_url || '',
        altText: p.name || 'Product Image',
        width: 1000,
        height: 1000
      },
      images: (p.image_url || p.mockup_url) 
        ? [{ url: p.image_url || p.mockup_url, altText: p.name, width: 1000, height: 1000 }] 
        : [],
      variants: [],
      updatedAt: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Failed to fetch Qikink products:', error);
    return [];
  }
}

