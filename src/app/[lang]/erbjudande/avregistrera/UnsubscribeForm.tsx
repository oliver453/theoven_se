'use client';

import { useState } from 'react';
import { FaPhone, FaCheckCircle, FaTimesCircle, FaArrowLeft } from 'react-icons/fa';

interface UnsubscribeFormProps {
  dict: {
    title: string;
    description: string;
    phoneLabel: string;
    phonePlaceholder: string;
    submitButton: string;
    submitting: string;
    successTitle: string;
    successMessage: string;
    errorNotFound: string;
    errorGeneral: string;
    infoText: string;
    backLink: string;
  };
  lang: string;
}

export default function UnsubscribeForm({ dict, lang }: UnsubscribeFormProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');
    setMessage('');

    try {
      const response = await fetch('/api/offer/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(dict.successMessage);
        setPhoneNumber('');
      } else {
        setStatus('error');
        setMessage(data.error || dict.errorGeneral);
      }
    } catch (error) {
      setStatus('error');
      setMessage(dict.errorGeneral);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="font-rustic text-4xl uppercase mb-3">
            {dict.title}
          </h1>
          <p className="text-white/60 font-roboto">
            {dict.description}
          </p>
        </div>

        {status === 'success' ? (
          <div className="bg-green-500/10 border border-green-500/20 p-6 text-center">
            <FaCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="font-rustic text-2xl uppercase mb-2">{dict.successTitle}</h2>
            <p className="text-white/80 font-roboto">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-roboto mb-2">
                {dict.phoneLabel}
              </label>
              <div className="relative">
              <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 scale-x-[-1]" />
              <input
                  type="tel"
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder={dict.phonePlaceholder}
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 
                           focus:outline-none focus:border-white/30 font-roboto
                           placeholder:text-white/30"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {status === 'error' && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 flex items-start gap-3">
                <FaTimesCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-200 font-roboto text-sm">{message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white text-black font-rustic uppercase py-3
                       hover:bg-white/90 transition-colors disabled:opacity-50 
                       disabled:cursor-not-allowed"
            >
              {isSubmitting ? dict.submitting : dict.submitButton}
            </button>

            <p className="text-white/40 text-sm font-roboto text-center">
              {dict.infoText}
            </p>
          </form>
        )}

        <div className="mt-8 text-center">
          <a 
            href={`/${lang}`}
            className="inline-flex items-center gap-2 text-white/60 hover:text-white font-roboto text-sm transition-colors"
          >
            <FaArrowLeft className="w-3 h-3" />
            {dict.backLink}
          </a>
        </div>
      </div>
    </div>
  );
}