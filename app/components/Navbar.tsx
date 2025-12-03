'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    checkAuth();
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/check');
      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(data.authenticated || false);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      // Silently handle errors - user is not logged in
      setIsLoggedIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsLoggedIn(false);
      // Force redirect to home page and refresh
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if API call fails, redirect to home
      window.location.href = '/';
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-white/5 shadow-2xl' 
        : 'bg-[#0a0a0f]/80 backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <span className="text-3xl font-black tracking-tight">
              <span className="text-primary-500 group-hover:text-primary-400 transition-colors">Circu</span>
              <span className="text-white group-hover:text-gray-100 transition-colors">Rent</span>
            </span>
          </Link>

          {/* Navigation Links - Centered */}
          <div className="hidden lg:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            <Link 
              href="/" 
              className="text-white/90 hover:text-primary-400 transition-colors font-bold text-sm uppercase tracking-widest"
            >
              {t.nav.home}
            </Link>
            <Link 
              href="/" 
              className="text-white/90 hover:text-primary-400 transition-colors font-bold text-sm uppercase tracking-widest"
            >
              Items
            </Link>
            <Link 
              href="/" 
              className="text-white/90 hover:text-primary-400 transition-colors font-bold text-sm uppercase tracking-widest"
            >
              Services
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="text-white/90 hover:text-primary-400 transition-colors font-semibold text-sm"
                >
                  {t.nav.myRentals}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-white/90 hover:text-primary-400 transition-colors font-semibold text-sm"
                >
                  {t.nav.logout}
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-white/90 hover:text-primary-400 transition-colors font-semibold text-sm"
                >
                  {t.nav.login}
                </Link>
                <Link 
                  href="/register" 
                  className="bg-primary-500 text-[#0a0a0f] px-5 py-2.5 rounded-full hover:bg-primary-400 transition-all font-black text-sm shadow-lg shadow-primary-500/40 hover:shadow-xl hover:shadow-primary-500/50 transform hover:scale-105"
                >
                  {t.nav.register}
                </Link>
              </>
            )}
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
}
