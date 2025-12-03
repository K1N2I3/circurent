'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';
import { Item } from '@/lib/db';
import ItemImage from '../components/ItemImage';

export default function RentalsPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Item[]>([]);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Check authentication
      const authResponse = await fetch('/api/auth/check');
      if (!authResponse.ok || !(await authResponse.json()).authenticated) {
        router.push('/login');
        return;
      }

      // Fetch user's items
      const itemsResponse = await fetch('/api/items/user');
      if (itemsResponse.ok) {
        const data = await itemsResponse.json();
        setItems(data);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (itemId: string, currentStatus: boolean) => {
    setUpdating(itemId);
    try {
      const response = await fetch(`/api/items/${itemId}/update`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available: !currentStatus }),
      });

      if (response.ok) {
        // Update local state
        setItems(items.map(item => 
          item.id === itemId ? { ...item, available: !currentStatus } : item
        ));
      }
    } catch (error) {
      console.error('Failed to update item:', error);
    } finally {
      setUpdating(null);
    }
  };

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
        <div className="mb-12 flex items-center justify-between">
          <div>
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
          <Link
            href="/rentals/add"
            className="bg-primary-500 text-[#0a0a0f] px-6 py-3 rounded-xl hover:bg-primary-400 transition-all font-black glow-green hover:glow-green-strong transform hover:scale-105"
          >
            + {language === 'en' ? 'Add Item' : 'Aggiungi Articolo'}
          </Link>
        </div>

        {items.length === 0 ? (
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
                href="/rentals/add"
                className="inline-block bg-primary-500 text-[#0a0a0f] px-8 py-4 rounded-xl hover:bg-primary-400 transition-all font-black glow-green hover:glow-green-strong transform hover:scale-105"
              >
                + {language === 'en' ? 'Add Your First Item' : 'Aggiungi il Tuo Primo Articolo'}
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="glass rounded-2xl overflow-hidden border border-white/10 card-hover"
              >
                <Link href={`/items/${item.id}`}>
                  <div className="aspect-square bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] relative overflow-hidden">
                    <ItemImage item={item} size="medium" className="w-full h-full" />
                  </div>
                </Link>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs bg-primary-500/20 text-primary-400 px-2.5 py-1 rounded-full font-bold border border-primary-500/30">
                      {item.category}
                    </span>
                    <div className="text-right">
                      <div className="text-xl font-black gradient-text">€{item.pricePerDay}</div>
                      <div className="text-xs text-gray-500">/day</div>
                    </div>
                  </div>
                  <h3 className="text-base font-black text-white mb-2 line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleAvailability(item.id, item.available);
                      }}
                      disabled={updating === item.id}
                      className={`px-4 py-2 rounded-xl font-black text-sm transition-all ${
                        item.available
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                          : 'bg-gray-700/50 text-gray-400 border border-gray-600/30 hover:bg-gray-700/70'
                      } ${updating === item.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {updating === item.id 
                        ? (language === 'en' ? 'Updating...' : 'Aggiornamento...')
                        : item.available
                        ? (language === 'en' ? '✓ Available' : '✓ Disponibile')
                        : (language === 'en' ? '✗ Unavailable' : '✗ Non Disponibile')
                      }
                    </button>
                    <Link
                      href={`/items/${item.id}`}
                      className="text-primary-400 hover:text-primary-300 text-sm font-bold"
                    >
                      {language === 'en' ? 'View →' : 'Visualizza →'}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

