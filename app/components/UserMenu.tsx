'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext';
import UserAvatar from './UserAvatar';

interface UserMenuProps {
  userName: string;
}

export default function UserMenu({ userName }: UserMenuProps) {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsOpen(false);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
      window.location.href = '/';
    }
  };

  const menuItems = [
    {
      label: language === 'en' ? 'Profile' : 'Profilo',
      href: '/profile',
      icon: '👤',
    },
    {
      label: language === 'en' ? 'My Orders' : 'I Miei Ordini',
      href: '/orders',
      icon: '📦',
    },
    {
      label: language === 'en' ? 'My Rentals' : 'I Miei Noleggi',
      href: '/rentals',
      icon: '🏠',
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full transition-all hover:opacity-80"
        aria-label="User menu"
      >
        <UserAvatar name={userName} size="md" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 glass rounded-2xl border border-white/10 shadow-2xl overflow-hidden z-50 animate-fade-in">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <UserAvatar name={userName} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-white truncate">{userName}</p>
              </div>
            </div>
          </div>
          
          <div className="py-2">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 text-sm text-white/90 hover:bg-white/5 transition-colors group"
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-semibold group-hover:text-primary-400 transition-colors">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>

          <div className="border-t border-white/10 py-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors font-semibold"
            >
              <span className="text-lg">🚪</span>
              <span>{t.nav.logout}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

