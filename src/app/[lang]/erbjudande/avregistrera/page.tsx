import { getDictionary } from '@/lib/dictionaries';
import { type Locale } from '../../../../../i18n.config';
import type { Metadata } from 'next';
import UnsubscribeForm from './UnsubscribeForm';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  
  return {
    title: lang === 'sv' ? 'Avregistrera dig | The Oven' : 'Unsubscribe | The Oven',
    description: lang === 'sv' 
      ? 'Avregistrera dig från våra SMS-utskick.'
      : 'Unsubscribe from our SMS messages.',
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function UnsubscribePage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return <UnsubscribeForm dict={(dict.privacy as any).unsubscribe} lang={lang} />;
}