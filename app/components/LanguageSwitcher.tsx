'use client';

import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '@/lib/i18n';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-1 glass rounded-xl p-1 border border-white/10">
      <button
        onClick={() => setLanguage('en')}
        className={`px-4 py-2 rounded-lg text-sm font-black transition-all ${
          language === 'en'
            ? 'bg-primary-500 text-[#0a0a0f] shadow-lg shadow-primary-500/30'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('it')}
        className={`px-4 py-2 rounded-lg text-sm font-black transition-all ${
          language === 'it'
            ? 'bg-primary-500 text-[#0a0a0f] shadow-lg shadow-primary-500/30'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        IT
      </button>
    </div>
  );
}
