'use client';

import { useEffect, useState } from 'react';
import { type Locale } from '../../../../../i18n.config';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SocialSidebar from '@/components/layout/SocialSidebar';
import { FaExclamationTriangle } from 'react-icons/fa';
import QRCode from 'qrcode';
import { DotLottiePlayer } from '@dotlottie/react-player';

interface ConfirmationClientProps {
  lang: Locale;
  code: string;
  dict: any;
}

export default function ConfirmationClient({ lang, code, dict }: ConfirmationClientProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [expiresDate, setExpiresDate] = useState<string>('');
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Visa loader efter 300ms om det fortfarande laddar
    const loaderTimer = setTimeout(() => {
      if (isLoading) {
        setShowLoader(true);
      }
    }, 300);

    async function loadData() {
      try {
        const response = await fetch(`/api/offer/verify?code=${code}`);
        const data = await response.json();

        if (data.valid) {
          const expires = new Date(data.expiresAt).toLocaleDateString('sv-SE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
          setExpiresDate(expires);

          const verifyUrl = `${window.location.origin}/api/offer/verify?code=${code}`;
          const qr = await QRCode.toDataURL(verifyUrl, {
            width: 400,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          });
          setQrDataUrl(qr);
        } else {
          setIsValid(false);
        }
      } catch (error) {
        console.error('Failed to load confirmation data:', error);
        setIsValid(false);
      } finally {
        clearTimeout(loaderTimer);
        setIsLoading(false);
        setTimeout(() => setShowContent(true), 100);
      }
    }

    loadData();

    return () => clearTimeout(loaderTimer);
  }, [code]);

  const t = dict.offer.confirmation;

  if (isLoading && showLoader) {
    return (
      <>
        <Header lang={lang} dict={dict} />
        <main className="min-h-screen bg-black flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
        </main>
        <Footer dict={dict} />
        <SocialSidebar />
      </>
    );
  }

  if (!isValid) {
    return (
      <>
        <Header lang={lang} dict={dict} />
        <main className="min-h-screen bg-black">
          <div className="container mx-auto px-4 lg:px-8 xl:px-12 pt-36 pb-16">
            <div className="max-w-lg mx-auto text-center">
              <div className="bg-red-500/10 border-2 border-red-500/50 rounded-lg p-8">
                <h1 className="text-3xl font-rustic uppercase text-white mb-4">
                  Ogiltig kod
                </h1>
                <p className="font-roboto text-white/80">
                  Koden du försöker använda är inte giltig, har redan använts eller har gått ut.
                </p>
              </div>
            </div>
          </div>
        </main>
        <Footer dict={dict} />
        <SocialSidebar />
      </>
    );
  }

  return (
    <>
      <Header lang={lang} dict={dict} />
      <main className="min-h-screen bg-black">
        <div
          className={`container mx-auto px-4 lg:px-8 xl:px-12 pt-24 sm:pt-32 lg:pt-48 pb-16 transition-opacity duration-500 ${
            showContent ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Mobile Layout */}
          <div className="lg:hidden max-w-lg mx-auto">
            <div className="w-20 h-20 mx-auto mb-6">
              <DotLottiePlayer
                src="/animations/Success.lottie"
                autoplay
                loop={false}
                background="transparent"
              />
            </div>

            <h1 className="mb-4 font-rustic uppercase text-4xl sm:text-5xl text-white text-center leading-tight">
              {t.title}
            </h1>
            <p className="font-roboto leading-relaxed text-white/70 mb-10 text-base sm:text-lg text-center">
              {t.description}
            </p>

            {/* QR Code Card */}
            {qrDataUrl && (
              <div className="bg-white rounded-2xl p-6 mb-8">
                <img
                  src={qrDataUrl}
                  alt="QR Code"
                  className="w-56 sm:w-64 mx-auto mb-3"
                />
                <p className="text-4xl sm:text-5xl font-rustic text-black tracking-widest font-bold text-center">
                {code.toUpperCase()}
                </p>
              </div>
            )}

            {/* Expiry Date */}
            {expiresDate && (
              <div className="text-center">
                <p className="text-white/70 text-sm font-roboto">
                  Giltig till
                </p>
                <p className="text-white/90 text-base font-roboto font-medium mt-1">
                  {expiresDate}
                </p>
              </div>
            )}
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:block max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 xl:gap-16 items-center">
              {/* Left side - Text content */}
              <div className="space-y-8">
                <div className="w-24 h-24">
                  <DotLottiePlayer
                    src="/animations/Success.lottie"
                    autoplay
                    loop={false}
                    background="transparent"
                  />
                </div>

                <div>
                  <h1 className="mb-6 font-rustic uppercase text-6xl xl:text-7xl text-white leading-tight">
                    {t.title}
                  </h1>
                  <p className="font-roboto leading-relaxed text-white/80 text-xl">
                    {t.description}
                  </p>
                </div>

                <div className="space-y-6 pt-4">
                  <div>
                    <p className="text-xs font-roboto uppercase text-white/60 tracking-wider mb-2">
                      {t.codeLabel}
                    </p>
                    <p className="text-5xl font-rustic text-white tracking-widest font-bold">
                      {code.toUpperCase()}
                    </p>
                  </div>

                  {expiresDate && (
                    <div className="pt-2">
                      <p className="text-white/60 text-base font-roboto">
                        Giltig till: <span className="text-white/90 font-medium">{expiresDate}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right side - QR Code */}
              <div className="flex items-center justify-center lg:justify-end">
                {qrDataUrl && (
                  <div className="bg-white rounded-2xl p-8">
                    <img
                      src={qrDataUrl}
                      alt="QR Code"
                      className="w-80 xl:w-96 mx-auto"
                    />
                    <p className="text-center text-gray-600 text-sm font-roboto mt-4">
                      Skanna för att använda
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer dict={dict} />
      <SocialSidebar />
    </>
  );
}