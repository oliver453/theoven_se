import { getDictionary } from '@/lib/dictionaries';
import { type Locale } from '../../../../../i18n.config';
import type { Metadata } from 'next';
import AdminDashboard from './AdminDashboard';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  
  return {
    title: lang === 'sv' ? 'Dashboard | The Oven' : 'Dashboard | The Oven',
    robots: {
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
    },
  };
}

export default async function AdminPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <>
      <main className="min-h-screen bg-black">
        <div className="container mx-auto px-4 lg:px-8 xl:px-12 pt-32 pb-16">
          <AdminDashboard dict={dict} lang={lang} />
        </div>
      </main>
    </>
  );
}