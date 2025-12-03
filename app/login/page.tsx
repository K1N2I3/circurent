'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || t.auth.loginError);
        return;
      }

      router.push('/');
      router.refresh();
    } catch (error) {
      setError(t.common.error);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] pt-20 px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary-500/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10 animate-fade-in">
          <h2 className="text-5xl font-black text-white mb-4 animate-slide-down">
            Welcome <span className="gradient-text animate-gradient">Back</span>
          </h2>
          <p className="text-gray-400 text-lg animate-slide-up">
            {t.auth.alreadyHaveAccount}{' '}
            <Link href="/register" className="text-primary-500 hover:text-primary-400 font-bold transition-colors">
              {t.nav.register}
            </Link>
          </p>
        </div>
        <form 
          className="glass rounded-3xl p-10 border border-white/10 shadow-2xl backdrop-blur-xl animate-scale-in" 
          onSubmit={handleSubmit}
        >
          {error && (
            <div className="bg-red-500/20 border-2 border-red-500/50 text-red-400 px-5 py-4 rounded-2xl mb-6">
              {error}
            </div>
          )}
          <div className="space-y-6">
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <label htmlFor="email" className="block text-sm font-black text-gray-300 mb-3 uppercase tracking-wider">
                {t.auth.email}
              </label>
              <div className="relative group">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-5 py-4 bg-[#0a0a0f] border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500/50 transition-all group-hover:border-white/20"
                  placeholder={t.auth.email}
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/0 via-primary-500/0 to-primary-500/0 group-hover:from-primary-500/5 group-hover:via-primary-500/10 group-hover:to-primary-500/5 transition-all pointer-events-none"></div>
              </div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <label htmlFor="password" className="block text-sm font-black text-gray-300 mb-3 uppercase tracking-wider">
                {t.auth.password}
              </label>
              <div className="relative group">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-5 py-4 bg-[#0a0a0f] border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500/50 transition-all group-hover:border-white/20"
                  placeholder={t.auth.password}
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/0 via-primary-500/0 to-primary-500/0 group-hover:from-primary-500/5 group-hover:via-primary-500/10 group-hover:to-primary-500/5 transition-all pointer-events-none"></div>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 px-4 bg-primary-500 text-[#0a0a0f] rounded-2xl font-black text-lg hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 transition-all glow-green hover:glow-green-strong transform hover:scale-[1.02] relative overflow-hidden group animate-fade-in"
              style={{ animationDelay: '0.3s' }}
            >
              <span className="relative z-10">{loading ? t.common.loading : t.auth.loginButton}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
