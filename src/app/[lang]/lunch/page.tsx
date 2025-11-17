import { getDictionary } from '@/lib/dictionaries';
import { type Locale } from '../../../../i18n.config';
import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SocialSidebar from '@/components/layout/SocialSidebar';
import LunchMenuDisplay from './LunchMenuDisplay';
import { BookingButton } from '@/components/booking';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  
  return {
    title: lang === 'sv' ? 'Lunchmeny | The Oven' : 'Lunch Menu | The Oven',
    description: lang === 'sv' 
      ? 'Veckans lunchmeny med dagens husman på The Oven i Arvika'
      : 'This week\'s lunch menu with daily specials at The Oven in Arvika',
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LunchPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <>
      <Header lang={lang} dict={dict} />
      <LunchMenuDisplay lang={lang} />
      <BookingButton dict={dict} />
      <Footer dict={dict} lang={lang} />
      <SocialSidebar />
    </>
  );
}