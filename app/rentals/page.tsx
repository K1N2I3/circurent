'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';

export default function RentalsPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        if (!response.ok || !(await response.json()).authenticated) {
          router.push('/login');
          return;
        }
      } catch (error) {
        router.push('/login');
        return;
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 bg-[#0a0a0f]">
        <div className="text-xl text-white">{t.common.loading}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
            {language === 'en' ? 'My ' : 'I Miei '}
            <span className="gradient-text">{language === 'en' ? 'Rentals' : 'Noleggi'}</span>
          </h1>
          <p className="text-gray-400 text-xl">
            {language === 'en' 
              ? 'Manage items you are renting out'
              : 'Gestisci gli articoli che stai noleggiando'
            }
          </p>
        </div>

        <div className="glass rounded-3xl p-12 text-center border border-white/10">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-6">🏠</div>
            <h2 className="text-3xl font-black text-white mb-4">
              {language === 'en' ? 'No Items Listed' : 'Nessun Articolo Elencato'}
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              {language === 'en' 
                ? 'You haven\'t listed any items for rent yet. Start by adding your first item!'
                : 'Non hai ancora elencato nessun articolo in affitto. Inizia aggiungendo il tuo primo articolo!'
              }
            </p>
            <Link
              href="/"
              className="inline-block bg-primary-500 text-[#0a0a0f] px-8 py-4 rounded-xl hover:bg-primary-400 transition-all font-black glow-green hover:glow-green-strong transform hover:scale-105"
            >
              {language === 'en' ? 'Browse Items' : 'Sfoglia Articoli'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

