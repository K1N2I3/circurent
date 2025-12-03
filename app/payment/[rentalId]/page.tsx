'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { Rental, Item } from '@/lib/db';
import { useLanguage } from '../../contexts/LanguageContext';

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const { t, language } = useLanguage();
  const [rental, setRental] = useState<Rental | null>(null);
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchRentalData();
  }, [params.rentalId]);

  const fetchRentalData = async () => {
    try {
      const rentalsResponse = await fetch('/api/rentals');
      if (!rentalsResponse.ok) {
        router.push('/login');
        return;
      }
      const rentals = await rentalsResponse.json();
      const currentRental = rentals.find((r: Rental) => r.id === params.rentalId);

      if (!currentRental) {
        router.push('/');
        return;
      }

      setRental(currentRental);

      const itemResponse = await fetch(`/api/items/${currentRental.itemId}`);
      if (itemResponse.ok) {
        const itemData = await itemResponse.json();
        setItem(itemData);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentId: string) => {
    setProcessing(true);
    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rentalId: rental?.id,
          paymentMethod: rental?.paymentMethod,
          paymentId,
        }),
      });

      if (response.ok) {
        router.push('/dashboard?success=true');
      } else {
        alert(t.payment.error);
      }
    } catch (error) {
      alert(t.common.error);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 bg-[#0a0a0f]">
        <div className="text-xl text-white">{t.common.loading}</div>
      </div>
    );
  }

  if (!rental || !item) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 bg-[#0a0a0f]">
        <div className="text-xl text-white">Data not found</div>
      </div>
    );
  }

  if (rental.status !== 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 bg-[#0a0a0f]">
        <div className="text-center glass rounded-3xl p-12 border border-white/10">
          <h2 className="text-3xl font-black text-white mb-6">{t.payment.alreadyPaid}</h2>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-primary-500 text-[#0a0a0f] px-8 py-4 rounded-xl hover:bg-primary-400 transition-all font-black glow-green"
          >
            {t.payment.viewRentals}
          </button>
        </div>
      </div>
    );
  }

  const locale = language === 'it' ? 'it-IT' : 'en-US';

  return (
    <div className="min-h-screen bg-[#0a0a0f] py-12 pt-20">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <h1 className="text-5xl font-black text-white mb-12 text-center">
          Complete <span className="gradient-text">Payment</span>
        </h1>

        <div className="glass rounded-3xl p-8 mb-8 border border-white/10 shadow-2xl">
          <h2 className="text-2xl font-black text-white mb-6">{t.payment.rentalDetails}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="glass rounded-2xl p-5 border border-white/10">
              <div className="text-xs text-gray-500 font-black uppercase tracking-wider mb-2">{t.payment.item}</div>
              <div className="text-white font-black text-lg">{item.name}</div>
            </div>
            <div className="glass rounded-2xl p-5 border border-white/10">
              <div className="text-xs text-gray-500 font-black uppercase tracking-wider mb-2">{t.payment.paymentMethod}</div>
              <div className="text-white font-black text-lg">
                {rental.paymentMethod === 'paypal' ? t.payment.payWithPaypal : t.payment.payWithCard}
              </div>
            </div>
            <div className="glass rounded-2xl p-5 border border-white/10">
              <div className="text-xs text-gray-500 font-black uppercase tracking-wider mb-2">{t.payment.startDate}</div>
              <div className="text-white font-black">{new Date(rental.startDate).toLocaleDateString(locale)}</div>
            </div>
            <div className="glass rounded-2xl p-5 border border-white/10">
              <div className="text-xs text-gray-500 font-black uppercase tracking-wider mb-2">{t.payment.endDate}</div>
              <div className="text-white font-black">{new Date(rental.endDate).toLocaleDateString(locale)}</div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-black text-white">{t.payment.totalPrice}:</span>
              <span className="text-5xl font-black gradient-text">€{rental.totalPrice}</span>
            </div>
          </div>
        </div>

        <div className="glass rounded-3xl p-8 border border-white/10 shadow-2xl">
          <h2 className="text-2xl font-black text-white mb-8">{t.payment.paymentMethod}</h2>

          {rental.paymentMethod === 'paypal' ? (
            <div className="bg-[#0a0a0f] rounded-2xl p-6 border border-white/10">
              <PayPalScriptProvider
                options={{
                  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'sb',
                  currency: 'EUR',
                }}
              >
                <PayPalButtons
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [
                        {
                          amount: {
                            value: rental.totalPrice.toString(),
                            currency_code: 'EUR',
                          },
                          description: `${t.payment.item} ${item.name}`,
                        },
                      ],
                    });
                  }}
                  onApprove={async (data, actions) => {
                    const order = await actions.order?.capture();
                    if (order) {
                      handlePaymentSuccess(order.id);
                    }
                  }}
                  onError={(err) => {
                    console.error('PayPal error:', err);
                    alert(t.payment.error);
                  }}
                  disabled={processing}
                />
              </PayPalScriptProvider>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="glass border-2 border-yellow-500/30 rounded-2xl p-5 bg-yellow-500/10">
                <p className="text-yellow-400 text-sm font-bold">
                  {t.payment.demoNotice}
                </p>
              </div>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setProcessing(true);
                  setTimeout(() => {
                    handlePaymentSuccess(`card_${Date.now()}`);
                  }, 1000);
                }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-black text-gray-300 mb-3 uppercase tracking-wider">
                    {t.payment.cardNumber}
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-5 py-4 bg-[#0a0a0f] border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-black text-gray-300 mb-3 uppercase tracking-wider">
                      {t.payment.expiryDate}
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-5 py-4 bg-[#0a0a0f] border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-black text-gray-300 mb-3 uppercase tracking-wider">
                      {t.payment.cvv}
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-5 py-4 bg-[#0a0a0f] border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-black text-gray-300 mb-3 uppercase tracking-wider">
                    {t.payment.cardholderName}
                  </label>
                  <input
                    type="text"
                    placeholder={t.payment.cardholderName}
                    className="w-full px-5 py-4 bg-[#0a0a0f] border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-primary-500 text-[#0a0a0f] px-8 py-5 rounded-2xl font-black text-lg hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 transition-all glow-green hover:glow-green-strong transform hover:scale-[1.02]"
                >
                  {processing ? t.payment.processing : `${t.payment.payButton} €${rental.totalPrice}`}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
