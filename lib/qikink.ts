// lib/qikink.ts
import { Product } from './types';

async function getSandboxToken() {
  const res = await fetch('https://sandbox.qikink.com/v1/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.QIKINK_CLIENT_ID,
      client_secret: process.env.QIKINK_CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });
  const data = await res.json();
  return data.access_token;
}

export async function getQikinkProducts(): Promise<Product[]> {
  try {
    // 1. Get the temporary token
    const token = await getSandboxToken();
    
    // 2. Fetch from the SANDBOX endpoint
    const res = await fetch('https://sandbox.qikink.com/v1/my_products', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    const data = await res.json();
    const productsArray = data.data || [];

    // 3. Map as usual
    return productsArray.map((p: any) => ({
      // ... (use the mapping logic we built in the previous steps)
      id: p.id?.toString() || 'mock-id',
      handle: p.slug || 'mock-product',
      title: p.name || 'Sandbox Product',
      // Ensure all required fields (tags, seo, transformedUrl) are included
    }));
  } catch (error) {
    console.error('Sandbox Fetch Error:', error);
    return [];
  }
}

