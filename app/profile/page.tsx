'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';
import UserAvatar from '../components/UserAvatar';
import { User } from '@/lib/db';

export default function ProfilePage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/user');
      if (!response.ok) {
        router.push('/login');
        return;
      }
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 bg-[#0a0a0f]">
        <div className="text-xl text-white">{t.common.loading}</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const locale = language === 'it' ? 'it-IT' : 'en-US';

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-20 pb-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link 
          href="/" 
          className="inline-flex items-center text-gray-400 hover:text-primary-400 mb-8 transition-colors group"
        >
          <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
          <span className="font-semibold">{t.common.back}</span>
        </Link>

        {/* Profile Card */}
        <div className="glass rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
          <div className="bg-gradient-to-r from-primary-500/20 via-primary-500/10 to-transparent p-8 border-b border-white/10">
            <div className="flex items-center space-x-6">
              <UserAvatar name={user.name} size="lg" />
              <div>
                <h1 className="text-4xl font-black text-white mb-2">{user.name}</h1>
                <p className="text-gray-400">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="space-y-6">
              {/* Email */}
              <div className="glass rounded-2xl p-6 border border-white/10">
                <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">
                  {language === 'en' ? 'Email Address' : 'Indirizzo Email'}
                </div>
                <div className="text-white font-semibold text-lg">{user.email}</div>
              </div>

              {/* Address */}
              <div className="glass rounded-2xl p-6 border border-white/10">
                <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">
                  {language === 'en' ? 'Address' : 'Indirizzo'}
                </div>
                <div className="text-white font-semibold text-lg">
                  {user.address ? (
                    typeof user.address === 'object' && 'street' in user.address ? (
                      <div className="space-y-1">
                        <div>{user.address.street}</div>
                        <div className="text-gray-400 text-sm">
                          {user.address.city}, {user.address.state} {user.address.postalCode}
                        </div>
                        <div className="text-gray-400 text-sm">{user.address.country}</div>
                      </div>
                    ) : (
                      // Fallback for old string format
                      String(user.address)
                    )
                  ) : (
                    language === 'en' ? 'Not provided' : 'Non fornito'
                  )}
                </div>
              </div>

              {/* Member Since */}
              <div className="glass rounded-2xl p-6 border border-white/10">
                <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">
                  {language === 'en' ? 'Member Since' : 'Membro Dal'}
                </div>
                <div className="text-white font-semibold text-lg">
                  {new Date(user.createdAt).toLocaleDateString(locale, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

