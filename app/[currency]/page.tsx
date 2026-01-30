import type { Metadata } from 'next';
import { Carousel } from 'components/carousel';
import { ThreeItemGrid } from 'components/grid/three-items';
import Footer from 'components/layout/footer';
import { Wrapper } from 'components/wrapper';
import { getShop, getShopOgImage } from 'lib/fourthwall';

// 1. Correct Static Params for dynamic segments
export function generateStaticParams() {
  return [
    { currency: 'USD' },
    { currency: 'INR' }, // Added INR for your Qikink products
    { currency: 'EUR' },
    { currency: 'GBP' }
  ];
}

export async function generateMetadata(): Promise<Metadata> {
  const [ogImageUrl, shop] = await Promise.all([
    getShopOgImage(),
    getShop()
  ]);

  return {
    title: shop.name,
    description: 'High-performance ecommerce store with Fourthwall and Qikink integration.',
    openGraph: {
      type: 'website',
      images: ogImageUrl ? [{ url: ogImageUrl }] : undefined
    }
  };
}

export default async function HomePage({ params }: { params: Promise<{ currency: string }> }) {
  const { currency } = await params;
  const shop = await getShop();

  // NOTE: In the template, ThreeItemGrid and Carousel handle their own fetching.
  // To show Qikink products, you must pass the currency down.
  // If currency is 'INR', these components should be programmed to fetch from your Qikink API.

  return (
    <Wrapper currency={currency} shop={shop}>
      <ThreeItemGrid currency={currency} />
      
      {/* Visual separation or a special section for Qikink could go here */}
      
      <Carousel currency={currency} />
      <Footer />
    </Wrapper>
  );
}
