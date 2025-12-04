'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Item } from '@/lib/db';
import { useLanguage } from '../../contexts/LanguageContext';
import { getCategoryTranslation } from '@/lib/i18n';
import ItemImage from '../../components/ItemImage';
import UserAvatar from '../../components/UserAvatar';

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t, language } = useLanguage();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [ownerInfo, setOwnerInfo] = useState<{ name: string; avatarUrl?: string } | null>(null);
  const [rentalData, setRentalData] = useState({
    startDate: '',
    endDate: '',
    paymentMethod: 'paypal' as 'paypal' | 'credit_card',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    checkAuth();
    fetchItem();
  }, [params.id]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/rentals');
      if (response.ok) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      setIsLoggedIn(false);
    }
  };

  const fetchItem = async () => {
    try {
      const response = await fetch(`/api/items/${params.id}`, {
        cache: 'no-store',
        next: { revalidate: 0 }
      });
      if (!response.ok) {
        router.push('/');
        return;
      }
      const data = await response.json();
      setItem(data);

      // Fetch owner info if item has userId
      if (data.userId) {
        try {
          const ownerResponse = await fetch(`/api/users/${data.userId}`);
          if (ownerResponse.ok) {
            const ownerData = await ownerResponse.json();
            setOwnerInfo(ownerData);
          }
        } catch (error) {
          console.error('Failed to fetch owner info:', error);
          // Fallback to ownerName
          setOwnerInfo({ name: data.ownerName });
        }
      } else {
        // For system items (CircuRent), use ownerName
        setOwnerInfo({ name: data.ownerName });
      }
    } catch (error) {
      console.error('Failed to fetch item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!rentalData.startDate || !rentalData.endDate) {
      setError(t.itemDetail.selectDates);
      return;
    }

    const start = new Date(rentalData.startDate);
    const end = new Date(rentalData.endDate);

    if (end <= start) {
      setError(t.itemDetail.invalidDates);
      return;
    }

    try {
      const response = await fetch('/api/rentals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId: item?.id,
          startDate: rentalData.startDate,
          endDate: rentalData.endDate,
          paymentMethod: rentalData.paymentMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || t.common.error);
        return;
      }

      router.push(`/payment/${data.id}`);
    } catch (error) {
      setError(t.common.error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 bg-[#0a0a0f]">
        <div className="text-xl text-white">{t.common.loading}</div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 bg-[#0a0a0f]">
        <div className="text-center">
          <div className="text-xl text-white mb-4">Item not found</div>
          <Link href="/" className="text-primary-500 hover:text-primary-400">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  const days = rentalData.startDate && rentalData.endDate
    ? Math.ceil((new Date(rentalData.endDate).getTime() - new Date(rentalData.startDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const totalPrice = days * item.pricePerDay;

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link 
          href="/" 
          className="inline-flex items-center text-gray-400 hover:text-primary-400 mb-8 transition-colors group"
        >
          <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
          <span className="font-semibold">{t.itemDetail.backToHome}</span>
        </Link>

        {/* Main Content Card */}
        <div className="glass rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
          <div className="lg:grid lg:grid-cols-2 gap-0">
            {/* Left Section - Image */}
            <div className="bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] p-12 lg:p-16 flex items-center justify-center min-h-[600px] relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(132,204,22,0.1),transparent_70%)]"></div>
              <ItemImage item={item} size="large" className="w-full h-full relative z-10" />
            </div>

            {/* Right Section - Details */}
            <div className="p-8 lg:p-12 bg-gradient-to-br from-[#1a1a2e]/50 to-[#0a0a0f]">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <span className="inline-flex items-center bg-primary-500/20 text-primary-400 px-4 py-2 rounded-full text-sm font-black border border-primary-500/30">
                    {getCategoryTranslation(language, item.category)}
                  </span>
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-black border ${
                    item.available
                      ? 'bg-green-500/20 text-green-400 border-green-500/30'
                      : 'bg-red-500/20 text-red-400 border-red-500/30'
                  }`}>
                    {item.available ? (
                      <>
                        <span className="mr-2">✓</span>
                        {t.itemDetail.available}
                      </>
                    ) : (
                      <>
                        <span className="mr-2">✗</span>
                        {t.itemDetail.notAvailable}
                      </>
                    )}
                  </div>
                </div>
                <h1 className="text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                  {item.name}
                </h1>
                <p className="text-lg text-gray-300 leading-relaxed mb-8">
                  {item.description}
                </p>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="glass rounded-2xl p-5 border border-white/10">
                  <div className="flex items-center text-gray-400 mb-3">
                    <span className="text-sm font-bold uppercase tracking-wider">{language === 'en' ? 'Owner' : 'Proprietario'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {ownerInfo && (
                      <UserAvatar 
                        name={ownerInfo.name} 
                        avatarUrl={ownerInfo.avatarUrl} 
                        size="md" 
                      />
                    )}
                    <div className="text-white font-black text-lg">{item.ownerName}</div>
                  </div>
                </div>
                <div className="glass rounded-2xl p-5 border border-white/10">
                  <div className="flex items-center text-gray-400 mb-3">
                    <span className="text-2xl mr-3">💰</span>
                    <span className="text-sm font-bold uppercase tracking-wider">{t.itemDetail.pricePerDay}</span>
                  </div>
                  <div className="text-3xl font-black gradient-text">€{item.pricePerDay}</div>
                </div>
              </div>

              {/* Rental Form */}
              {!isLoggedIn ? (
                <div className="glass border-2 border-yellow-500/30 rounded-2xl p-6 mb-6 bg-yellow-500/5">
                  <p className="text-yellow-400 mb-4 font-bold">{t.itemDetail.loginPrompt}</p>
                  <div className="flex gap-3">
                    <Link
                      href="/login"
                      className="flex-1 bg-primary-500 text-[#0a0a0f] px-6 py-4 rounded-xl font-black hover:bg-primary-400 transition-all text-center glow-green"
                    >
                      {t.itemDetail.loginButton}
                    </Link>
                    <Link
                      href="/register"
                      className="flex-1 glass border-2 border-white/20 text-white px-6 py-4 rounded-xl font-black hover:bg-white/10 transition-all text-center"
                    >
                      {t.itemDetail.registerButton}
                    </Link>
                  </div>
                </div>
              ) : item.available ? (
                <form onSubmit={handleRent} className="space-y-6">
                  {error && (
                    <div className="glass border-2 border-red-500/50 text-red-400 px-5 py-4 rounded-2xl bg-red-500/10">
                      {error}
                    </div>
                  )}

                  {/* Date Selection */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-black text-gray-300 mb-3 uppercase tracking-wider">
                        {t.itemDetail.startDate}
                      </label>
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={rentalData.startDate}
                        onChange={(e) => setRentalData({ ...rentalData, startDate: e.target.value })}
                        className="w-full px-5 py-4 bg-[#0a0a0f] border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-black text-gray-300 mb-3 uppercase tracking-wider">
                        {t.itemDetail.endDate}
                      </label>
                      <input
                        type="date"
                        required
                        min={rentalData.startDate || new Date().toISOString().split('T')[0]}
                        value={rentalData.endDate}
                        onChange={(e) => setRentalData({ ...rentalData, endDate: e.target.value })}
                        className="w-full px-5 py-4 bg-[#0a0a0f] border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-black text-gray-300 mb-4 uppercase tracking-wider">
                      {t.itemDetail.paymentMethod}
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                        rentalData.paymentMethod === 'paypal'
                          ? 'bg-primary-500/20 border-primary-500 glass'
                          : 'bg-[#0a0a0f] border-white/10 hover:border-white/20'
                      }`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="paypal"
                          checked={rentalData.paymentMethod === 'paypal'}
                          onChange={(e) => setRentalData({ ...rentalData, paymentMethod: 'paypal' })}
                          className="sr-only"
                        />
                        <div className="text-4xl mb-3">💳</div>
                        <div className={`font-black ${
                          rentalData.paymentMethod === 'paypal' ? 'text-primary-400' : 'text-gray-400'
                        }`}>
                          {t.itemDetail.paypal}
                        </div>
                      </label>
                      <label className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                        rentalData.paymentMethod === 'credit_card'
                          ? 'bg-primary-500/20 border-primary-500 glass'
                          : 'bg-[#0a0a0f] border-white/10 hover:border-white/20'
                      }`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="credit_card"
                          checked={rentalData.paymentMethod === 'credit_card'}
                          onChange={(e) => setRentalData({ ...rentalData, paymentMethod: 'credit_card' })}
                          className="sr-only"
                        />
                        <div className="text-4xl mb-3">💳</div>
                        <div className={`font-black ${
                          rentalData.paymentMethod === 'credit_card' ? 'text-primary-400' : 'text-gray-400'
                        }`}>
                          {t.itemDetail.creditCard}
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Price Summary */}
                  {days > 0 && (
                    <div className="glass rounded-2xl p-6 border border-white/10 bg-gradient-to-br from-[#1a1a2e]/50 to-[#0a0a0f]">
                      <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
                        <span className="text-gray-400 font-bold uppercase tracking-wider text-sm">{t.itemDetail.rentalDays}:</span>
                        <span className="text-white font-black text-xl">{days} {language === 'it' ? 'giorni' : 'days'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 font-black text-xl">{t.itemDetail.totalPrice}:</span>
                        <span className="text-5xl font-black gradient-text">€{totalPrice}</span>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-primary-500 text-[#0a0a0f] px-8 py-6 rounded-2xl font-black text-xl hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all glow-green hover:glow-green-strong transform hover:scale-[1.02]"
                  >
                    {t.itemDetail.rentNow}
                  </button>
                </form>
              ) : (
                <div className="glass border-2 border-red-500/30 rounded-2xl p-6 bg-red-500/10">
                  <p className="text-red-400 font-bold">{t.itemDetail.notAvailable}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
