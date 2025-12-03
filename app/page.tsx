'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Item } from '@/lib/db';
import { useLanguage } from './contexts/LanguageContext';
import { getCategoryTranslation } from '@/lib/i18n';
import ItemImage from './components/ItemImage';

const ITEMS_PER_PAGE = 12;

export default function Home() {
  const { t, language } = useLanguage();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(t.common.all);
  const [currentPage, setCurrentPage] = useState(1);
  const [featuredItems, setFeaturedItems] = useState<Item[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetchItems();
    checkAuth();
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      const shuffled = [...items].sort(() => 0.5 - Math.random());
      setFeaturedItems(shuffled.slice(0, 4));
    }
  }, [items]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/rentals');
      if (response.ok) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      setIsLoggedIn(false);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/items');
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setLoading(false);
    }
  };

  const allCategories = Array.from(new Set(items.map(item => item.category)));
  const categories = [t.common.all, ...allCategories];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === t.common.all || item.category === selectedCategory;
    return matchesSearch && matchesCategory && item.available;
  });

  // Limit items for non-logged-in users
  const maxItemsForGuest = 8;
  const itemsToShow = isLoggedIn ? filteredItems : filteredItems.slice(0, maxItemsForGuest);
  
  const totalPages = Math.ceil(itemsToShow.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayedItems = itemsToShow.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 bg-[#0a0a0f]">
        <div className="text-xl text-white">{t.common.loading}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-20 pb-32">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0a0a0f]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(132,204,22,0.1),transparent_50%)]"></div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-32">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-full text-primary-400 text-sm font-semibold mb-6">
                Premium Rental Platform
              </span>
            </div>
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-black text-white mb-8 leading-[0.9]">
              Rent Premium
              <br />
              <span className="gradient-text">Items</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              Discover and rent high-quality items for your needs. From electronics to sports equipment, we have it all.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#catalog"
                className="group relative inline-flex items-center justify-center bg-primary-500 text-[#0a0a0f] px-10 py-5 rounded-2xl font-black text-lg hover:bg-primary-400 transition-all glow-green hover:glow-green-strong transform hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10">Browse Catalog</span>
                <div className="absolute inset-0 shine-effect opacity-0 group-hover:opacity-100"></div>
              </Link>
              <Link
                href="#featured"
                className="inline-flex items-center justify-center glass text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all border border-white/20"
              >
                Featured Items
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-white/5 bg-gradient-to-r from-[#1a1a2e]/50 to-[#0a0a0f]/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="text-6xl md:text-7xl font-black gradient-text mb-3 group-hover:scale-110 transition-transform">100+</div>
              <div className="text-gray-400 text-lg font-medium">Item Types</div>
            </div>
            <div className="text-center group">
              <div className="text-6xl md:text-7xl font-black gradient-text mb-3 group-hover:scale-110 transition-transform">20k+</div>
              <div className="text-gray-400 text-lg font-medium">Happy Customers</div>
            </div>
            <div className="text-center group">
              <div className="text-6xl md:text-7xl font-black gradient-text mb-3 group-hover:scale-110 transition-transform">50+</div>
              <div className="text-gray-400 text-lg font-medium">Cities</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      {featuredItems.length > 0 && (
        <section id="featured" className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
          <div className="mb-16 text-center">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-4">
              Featured <span className="gradient-text">Selection</span>
            </h2>
            <p className="text-gray-400 text-xl">Handpicked premium items for you</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredItems.map((item, index) => (
              <Link
                key={item.id}
                href={`/items/${item.id}`}
                className="group relative glass rounded-3xl overflow-hidden border border-white/10 card-hover"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="aspect-square bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] relative overflow-hidden">
                  <ItemImage item={item} size="large" className="w-full h-full" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-primary-500 text-[#0a0a0f] px-4 py-2 rounded-xl font-black text-sm shadow-lg">
                      View →
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs bg-primary-500/20 text-primary-400 px-3 py-1.5 rounded-full font-bold border border-primary-500/30">
                      {getCategoryTranslation(language, item.category)}
                    </span>
                    <div className="text-right">
                      <div className="text-2xl font-black gradient-text">€{item.pricePerDay}</div>
                      <div className="text-xs text-gray-500 font-medium">per day</div>
                    </div>
                  </div>
                  <h3 className="text-lg font-black text-white mb-2 group-hover:text-primary-400 transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-4 leading-relaxed">{item.description}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="mr-1.5">📍</span>
                    <span className="font-medium">{item.location}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Catalog Section - Only show when logged in */}
      {isLoggedIn && (
      <section id="catalog" className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="mb-12 text-center">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-4">
            Browse <span className="gradient-text">Catalog</span>
          </h2>
          <p className="text-gray-400 text-xl">Find the perfect item for your needs</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-10 glass rounded-3xl p-6 border border-white/10">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder={t.home.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-6 py-4 bg-[#0a0a0f] border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="px-6 py-4 bg-[#0a0a0f] border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === t.common.all ? t.common.all : getCategoryTranslation(language, category)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Items Grid */}
        {displayedItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">{t.home.noItemsFound}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {displayedItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/items/${item.id}`}
                  className="group glass rounded-2xl overflow-hidden border border-white/10 card-hover"
                >
                  <div className="aspect-square bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] relative overflow-hidden">
                    <ItemImage item={item} size="medium" className="w-full h-full" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs bg-primary-500/20 text-primary-400 px-2.5 py-1 rounded-full font-bold border border-primary-500/30">
                        {getCategoryTranslation(language, item.category)}
                      </span>
                      <div className="text-right">
                        <div className="text-xl font-black gradient-text">€{item.pricePerDay}</div>
                        <div className="text-xs text-gray-500">/day</div>
                      </div>
                    </div>
                    <h3 className="text-base font-black text-white mb-2 group-hover:text-primary-400 transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-400 mb-3 line-clamp-2 leading-relaxed">{item.description}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="mr-1.5">📍</span>
                      <span className="font-medium">{item.location}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination - Only show for logged in users */}
            {totalPages > 1 && isLoggedIn && (
              <div className="flex justify-center items-center space-x-3 mb-12">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-6 py-3 glass border border-white/10 rounded-xl text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-bold"
                >
                  ← Previous
                </button>
                <div className="flex space-x-2">
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    let page;
                    if (totalPages <= 7) {
                      page = i + 1;
                    } else if (currentPage <= 4) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 3) {
                      page = totalPages - 6 + i;
                    } else {
                      page = currentPage - 3 + i;
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-5 py-3 rounded-xl font-black transition-all ${
                          currentPage === page
                            ? 'bg-primary-500 text-[#0a0a0f] shadow-lg shadow-primary-500/30'
                            : 'glass border border-white/10 text-white hover:bg-white/5'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-6 py-3 glass border border-white/10 rounded-xl text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-bold"
                >
                  Next →
                </button>
              </div>
            )}

          </>
        )}
      </section>
      )}

      {/* Login/Sign Up Prompt for Guests - Show after Featured Items */}
      {!isLoggedIn && (
        <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 via-primary-500/10 to-transparent"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(132,204,22,0.15),transparent_70%)]"></div>
            <div className="relative glass rounded-3xl p-12 border-2 border-primary-500/30">
              <div className="text-center max-w-3xl mx-auto">
                <div className="mb-8">
                  <div className="inline-block px-6 py-3 bg-primary-500/20 border border-primary-500/30 rounded-full text-primary-400 text-sm font-black mb-6">
                    {t.home.unlockFullAccess}
                  </div>
                  <h3 className="text-4xl md:text-5xl font-black text-white mb-4">
                    {language === 'en' ? (
                      <>Sign In or <span className="gradient-text">Sign Up</span></>
                    ) : (
                      <>Accedi o <span className="gradient-text">Registrati</span></>
                    )}
                  </h3>
                  <p className="text-xl text-gray-300 leading-relaxed">
                    {t.home.createAccountPrompt.replace('{count}', filteredItems.length.toString())}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center bg-primary-500 text-[#0a0a0f] px-10 py-5 rounded-2xl font-black text-lg hover:bg-primary-400 transition-all glow-green hover:glow-green-strong transform hover:scale-105"
                  >
                    {t.nav.login}
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center glass border-2 border-primary-500/50 text-primary-400 px-10 py-5 rounded-2xl font-black text-lg hover:bg-primary-500/10 hover:border-primary-500 transition-all"
                  >
                    {t.nav.register}
                  </Link>
                </div>
                <div className="pt-6 border-t border-white/10">
                  <p className="text-gray-400 text-sm">
                    {t.home.alreadyHaveAccount} <Link href="/login" className="text-primary-400 hover:text-primary-300 font-bold">{t.nav.login}</Link> {language === 'en' ? 'or' : 'o'} <Link href="/register" className="text-primary-400 hover:text-primary-300 font-bold">{t.nav.register}</Link> {language === 'en' ? 'to continue browsing' : 'per continuare a sfogliare'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Bottom Search Bar */}
      <div className="fixed bottom-0 left-0 right-0 glass border-t border-white/10 z-40 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 bg-[#0a0a0f] rounded-2xl p-4 border border-white/10 hover:border-primary-500/50 transition-all cursor-pointer group">
              <span className="text-2xl">📍</span>
              <div className="flex-1">
                <div className="text-white text-sm font-bold group-hover:text-primary-400 transition-colors">Choose location</div>
                <div className="text-gray-500 text-xs">Select city</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 bg-[#0a0a0f] rounded-2xl p-4 border border-white/10 hover:border-primary-500/50 transition-all cursor-pointer group">
              <span className="text-2xl">📅</span>
              <div className="flex-1">
                <div className="text-white text-sm font-bold group-hover:text-primary-400 transition-colors">Pick-up date</div>
                <div className="text-gray-500 text-xs">Select date</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 bg-[#0a0a0f] rounded-2xl p-4 border border-white/10 hover:border-primary-500/50 transition-all cursor-pointer group">
              <span className="text-2xl">📅</span>
              <div className="flex-1">
                <div className="text-white text-sm font-bold group-hover:text-primary-400 transition-colors">Return date</div>
                <div className="text-gray-500 text-xs">Select date</div>
              </div>
            </div>
            <button className="bg-primary-500 text-[#0a0a0f] px-6 py-4 rounded-2xl font-black hover:bg-primary-400 transition-all flex items-center justify-center space-x-2 glow-green hover:glow-green-strong transform hover:scale-105">
              <span className="text-xl">🔍</span>
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
