// lib/qikink.ts
import { Product } from './types';

export async function getQikinkProducts(): Promise<Product[]> {
  const endpoint = 'https://api.qikink.com/v1/my_products'; 

  try {
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.QIKINK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 } // Temporarily disable cache to see fresh data
    });

    const data = await res.json();
    
    // THIS LOG IS KEY: Check your Vercel logs to see this output
    console.log('Qikink Raw Data:', JSON.stringify(data).substring(0, 500));

    // Try multiple possible paths for the products array
    const productsArray = data.data || data.products || (Array.isArray(data) ? data : []);

    if (productsArray.length === 0) {
      console.warn('Qikink API returned successfully, but the product list is empty.');
      return [];
    }

    return productsArray.map((p: any) => {
      const imageUrl = p.image_url || p.mockup_url || p.image || '';
      const price = (p.selling_price || p.price || 0).toString();
      const handle = p.slug || p.sku || p.id?.toString() || 'product';

      return {
        id: p.id?.toString() || handle,
        handle: handle,
        availableForSale: true,
        title: p.name || 'Qikink Product',
        description: p.description || '',
        descriptionHtml: p.description || '',
        options: [],
        path: `/INR/product/${handle}`,
        priceRange: {
          maxVariantPrice: { amount: price, currencyCode: 'INR' },
          minVariantPrice: { amount: price, currencyCode: 'INR' }
        },
        featuredImage: {
          url: imageUrl,
          transformedUrl: imageUrl,
          altText: p.name || 'Product Image',
          width: 1000,
          height: 1000
        },
        images: imageUrl ? [{ url: imageUrl, transformedUrl: imageUrl, altText: p.name, width: 1000, height: 1000 }] : [],
        variants: [],
        tags: [],
        seo: { title: p.name || '', description: p.description || '' },
        updatedAt: new Date().toISOString()
      };
    });
  } catch (error) {
    console.error('Qikink Fetch Error:', error);
    return [];
  }
}
