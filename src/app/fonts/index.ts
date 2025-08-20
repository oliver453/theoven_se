import localFont from 'next/font/local';

export const Copernicus = localFont({
  src: [
    {
      path: './copernicus.p.woff2',
      weight: '200',
      style: 'normal',
    },
  ],
  variable: '--font-copernicus',
});

export const Styrne = localFont({
  src: [
    {
      path: './styrne.p.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-styrne',
});