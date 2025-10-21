// src/app/[lang]/erbjudande/bekraftelse/page.tsx
import { getDictionary } from '@/lib/dictionaries';
import { type Locale } from '../../../../../i18n.config';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import ConfirmationClient from './ConfirmationClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  
  return {
    title: lang === 'sv' ? 'Bekräftelse | The Oven' : 'Confirmation | The Oven',
    robots: {
      index: false,
      follow: false,
      noarchive: true,
    },
  };
}

export default async function ConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: Locale }>;
  searchParams: Promise<{ code?: string }>;
}) {
  const { lang } = await params;
  const { code } = await searchParams;

  // Om ingen kod finns, redirecta tillbaka till erbjudande-sidan
  if (!code) {
    redirect(`/${lang}/erbjudande`);
  }

  // Ladda dictionary på serversidan
  const dict = await getDictionary(lang);

  return <ConfirmationClient lang={lang} code={code} dict={dict} />;
}