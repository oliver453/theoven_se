import { siteConfig } from '@/app/metadata';

type StructuredDataProps = {
  lang: 'sv' | 'en';
  type?: 'home' | 'menu';
};

export function StructuredData({ lang, type = 'home' }: StructuredDataProps) {
  const restaurantData = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: siteConfig.shortName,
    description: lang === 'sv' ? siteConfig.description : siteConfig.en.description,
    url: lang === 'sv' ? siteConfig.url : `${siteConfig.url}/en`,
    image: `${siteConfig.url}/og.png`,
    logo: `${siteConfig.url}/the-oven.svg`,
    telephone: siteConfig.phone,
    priceRange: '$$',
    servesCuisine: ['Italian', 'Pizza', 'Neapolitan'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '59.65479679282539',
      longitude: '12.59550767923555',
    },
    openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Monday',
          opens: '00:00',
          closes: '00:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday'],
          opens: '16:00',
          closes: '21:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Friday',
          opens: '14:00',
          closes: '23:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Saturday',
          opens: '12:00',
          closes: '23:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Sunday',
          opens: '00:00',
          closes: '00:00',
        },
      ],      
    menu: `${siteConfig.url}/${lang === 'sv' ? 'meny' : 'en/meny'}`,
    acceptsReservations: 'True',
  };

  if (type === 'home') {
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(restaurantData),
        }}
      />
    );
  }

  const menuData = {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: lang === 'sv' ? 'Meny' : 'Menu',
    description:
      lang === 'sv'
        ? 'Äkta napolitansk pizza och italienska rätter'
        : 'Authentic Neapolitan pizza and Italian dishes',
    inLanguage: lang === 'sv' ? 'sv-SE' : 'en-GB',
    hasMenuSection: [
      {
        '@type': 'MenuSection',
        name: 'Pizza',
        description:
          lang === 'sv'
            ? 'Äkta napolitansk pizza bakad i vedugn'
            : 'Authentic Neapolitan pizza baked in wood-fired oven',
      },
      {
        '@type': 'MenuSection',
        name: lang === 'sv' ? 'Förrätter' : 'Starters',
      },
      {
        '@type': 'MenuSection',
        name: lang === 'sv' ? 'Huvudrätter' : 'Main Courses',
      },
      {
        '@type': 'MenuSection',
        name: lang === 'sv' ? 'Efterrätter' : 'Desserts',
      },
    ],
  };

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteConfig.url,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: lang === 'sv' ? 'Meny' : 'Menu',
        item: `${siteConfig.url}/${lang === 'sv' ? 'meny' : 'en/meny'}`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([restaurantData, menuData, breadcrumbData]),
      }}
    />
  );
}