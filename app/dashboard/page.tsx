'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Rental, Item } from '@/lib/db';
import { useLanguage } from '../contexts/LanguageContext';
import ItemImage from '../components/ItemImage';

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, language } = useLanguage();
  const [rentals, setRentals] = useState<(Rental & { item: Item })[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchData();
    if (searchParams.get('success') === 'true') {
      alert(t.payment.success);
      router.replace('/dashboard');
    }
  }, []);

  const fetchData = async () => {
    try {
      const rentalsResponse = await fetch('/api/rentals');
      if (!rentalsResponse.ok) {
        router.push('/login');
        return;
      }
      const rentalsData = await rentalsResponse.json();

      const rentalsWithItems = await Promise.all(
        rentalsData.map(async (rental: Rental) => {
          const itemResponse = await fetch(`/api/items/${rental.itemId}`);
          const item = await itemResponse.json();
          return { ...rental, item };
        })
      );

      setRentals(rentalsWithItems);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'completed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return t.dashboard.status.confirmed;
      case 'pending':
        return t.dashboard.status.pending;
      case 'completed':
        return t.dashboard.status.completed;
      case 'cancelled':
        return t.dashboard.status.cancelled;
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 bg-[#0a0a0f]">
        <div className="text-xl text-white">{t.common.loading}</div>
      </div>
    );
  }

  const locale = language === 'it' ? 'it-IT' : 'en-US';

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="mb-12 flex justify-between items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
              My <span className="gradient-text">Rentals</span>
            </h1>
            <p className="text-gray-400 text-xl">{t.dashboard.subtitle}</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/"
              className="glass border border-white/10 text-white px-6 py-3 rounded-xl hover:bg-white/5 transition-all font-bold"
            >
              {t.dashboard.browseItems}
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500/20 border-2 border-red-500/30 text-red-400 px-6 py-3 rounded-xl hover:bg-red-500/30 transition-all font-bold"
            >
              {t.nav.logout}
            </button>
          </div>
        </div>

        {rentals.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center border border-white/10">
            <p className="text-gray-400 text-xl mb-6">{t.dashboard.noRentals}</p>
            <Link
              href="/"
              className="inline-block bg-primary-500 text-[#0a0a0f] px-8 py-4 rounded-xl hover:bg-primary-400 transition-all font-black glow-green"
            >
              {t.dashboard.browseItems}
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {rentals.map((rental) => (
              <div
                key={rental.id}
                className="glass rounded-3xl overflow-hidden border border-white/10 card-hover"
              >
                <div className="lg:grid lg:grid-cols-12 gap-6 p-6">
                  {/* Item Image */}
                  <div className="lg:col-span-3 mb-4 lg:mb-0">
                    <div className="aspect-square bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] rounded-2xl overflow-hidden">
                      <ItemImage item={rental.item} size="medium" className="w-full h-full" />
                    </div>
                  </div>

                  {/* Item Details */}
                  <div className="lg:col-span-7">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-black text-white mb-2">
                          {rental.item.name}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{rental.item.description}</p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-black border ${getStatusColor(rental.status)}`}>
                        {getStatusText(rental.status)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="glass rounded-xl p-4 border border-white/10">
                        <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">{t.dashboard.startDate}</div>
                        <div className="text-white font-black">
                          {new Date(rental.startDate).toLocaleDateString(locale)}
                        </div>
                      </div>
                      <div className="glass rounded-xl p-4 border border-white/10">
                        <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">{t.dashboard.endDate}</div>
                        <div className="text-white font-black">
                          {new Date(rental.endDate).toLocaleDateString(locale)}
                        </div>
                      </div>
                      <div className="glass rounded-xl p-4 border border-white/10">
                        <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">{t.dashboard.paymentMethod}</div>
                        <div className="text-white font-black">
                          {rental.paymentMethod === 'paypal' ? t.itemDetail.paypal : t.itemDetail.creditCard}
                        </div>
                      </div>
                      <div className="glass rounded-xl p-4 border border-white/10">
                        <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">{t.dashboard.totalPrice}</div>
                        <div className="text-2xl font-black gradient-text">
                          €{rental.totalPrice}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  {rental.status === 'pending' && (
                    <div className="lg:col-span-2 flex items-center">
                      <Link
                        href={`/payment/${rental.id}`}
                        className="w-full bg-primary-500 text-[#0a0a0f] px-6 py-4 rounded-xl hover:bg-primary-400 transition-all text-center font-black glow-green hover:glow-green-strong transform hover:scale-105"
                      >
                        {t.dashboard.completePayment}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
