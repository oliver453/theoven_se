// src/app/[lang]/erbjudande/page.tsx
import { getDictionary } from '@/lib/dictionaries';
import { type Locale } from '../../../../i18n.config';
import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SocialSidebar from '@/components/layout/SocialSidebar';
import OfferForm from './OfferForm';
import Image from 'next/image';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  
  return {
    title: lang === 'sv' ? 'Specialerbjudande | The Oven' : 'Special Offer | The Oven',
    robots: {
      index: false,
      follow: false,
      noarchive: true,
    },
  };
}

export default async function OfferPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <>
      <Header lang={lang} dict={dict} />
      <main className="relative min-h-screen overflow-hidden">
        <Image
          src="/images/1.webp"
          alt=""
          fill
          priority
          quality={90}
          className="object-cover z-0"
        />
        
        <div className="absolute inset-0 bg-black/60 z-10"></div>

        <div className="relative z-20 container mx-auto px-4 lg:px-8 xl:px-12 pt-48 lg:pt-48 pb-16">
          <div className="max-w-lg mx-auto">
            <h1 className="mb-4 font-rustic uppercase text-5xl md:text-6xl text-white text-center">
              {dict.offer.page.title}
            </h1>
            <p className="font-roboto leading-relaxed text-white/80 text-center mb-12 text-lg">
              {dict.offer.page.description}
            </p>
            <OfferForm dict={dict} lang={lang} />
          </div>
        </div>
      </main>
      <Footer dict={dict} />
      <SocialSidebar />
    </>
  );
}