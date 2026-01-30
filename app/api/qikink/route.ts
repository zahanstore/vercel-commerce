import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://api.qikink.com/v1/products', {
      headers: {
        'Authorization': `Bearer ${process.env.QIKINK_API_KEY}`,
      },
    });
    const data = await res.json();
    
    // Format Qikink products to match your site's structure
    const formattedProducts = data.products.map((p: any) => ({
      id: p.id,
      title: p.name,
      handle: p.slug,
      priceRange: { minVariantPrice: { amount: p.price, currencyCode: 'INR' } },
      featuredImage: { url: p.image_url },
      vendor: 'Qikink'
    }));

    return NextResponse.json(formattedProducts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch Qikink' }, { status: 500 });
  }
}
