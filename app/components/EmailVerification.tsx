'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface EmailVerificationProps {
  email: string;
  onVerify: (isVerified: boolean) => void;
}

export default function EmailVerification({ email, onVerify }: EmailVerificationProps) {
  const { language } = useLanguage();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const sendVerificationCode = async () => {
    setSending(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || (language === 'en' ? 'Failed to send verification code' : 'Invio codice di verifica fallito'));
        return;
      }

      setSuccess(language === 'en' ? 'Verification code sent! Check your email.' : 'Codice di verifica inviato! Controlla la tua email.');
      setCountdown(60); // 60 seconds cooldown
    } catch (error) {
      setError(language === 'en' ? 'Failed to send verification code' : 'Invio codice di verifica fallito');
    } finally {
      setSending(false);
    }
  };

  const verifyCode = async () => {
    if (code.length !== 6) {
      setError(language === 'en' ? 'Please enter a 6-digit code' : 'Inserisci un codice a 6 cifre');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || (language === 'en' ? 'Invalid verification code' : 'Codice di verifica non valido'));
        onVerify(false);
        return;
      }

      setSuccess(language === 'en' ? 'Email verified successfully!' : 'Email verificata con successo!');
      onVerify(true);
    } catch (error) {
      setError(language === 'en' ? 'Verification failed' : 'Verifica fallita');
      onVerify(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-send verification code when component mounts
    sendVerificationCode();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-black text-gray-300 mb-4 uppercase tracking-wider">
          {language === 'en' ? 'Email Verification' : 'Verifica Email'}
        </label>
        
        <div className="mb-6 p-5 glass rounded-2xl border border-white/10">
          <p className="text-gray-300 text-sm leading-relaxed">
            {language === 'en' 
              ? `We've sent a verification code to` 
              : `Abbiamo inviato un codice di verifica a`
            }
          </p>
          <p className="text-primary-400 font-bold text-base mt-1 break-all">
            {email}
          </p>
          <p className="text-gray-400 text-xs mt-2">
            {language === 'en' 
              ? `Please check your inbox and enter the code below.`
              : `Controlla la tua casella di posta e inserisci il codice qui sotto.`
            }
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border-2 border-red-500/50 text-red-400 px-5 py-4 rounded-2xl mb-6 animate-fade-in">
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-primary-500/20 border-2 border-primary-500/50 text-primary-400 px-5 py-4 rounded-2xl mb-6 animate-fade-in">
            <div className="flex items-center gap-2">
              <span>✅</span>
              <span>{success}</span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex gap-3 items-center">
            <div className="flex-1 relative group">
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setCode(value);
                  setError('');
                }}
                className="w-full px-6 py-5 bg-[#0a0a0f] border-2 border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500/50 transition-all text-center text-3xl font-black tracking-[0.5em] group-hover:border-white/20"
                placeholder="000000"
                maxLength={6}
                autoFocus
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/0 via-primary-500/0 to-primary-500/0 group-hover:from-primary-500/5 group-hover:via-primary-500/10 group-hover:to-primary-500/5 transition-all pointer-events-none"></div>
            </div>
            <button
              type="button"
              onClick={verifyCode}
              disabled={loading || code.length !== 6}
              className="px-8 py-5 bg-primary-500 text-[#0a0a0f] rounded-2xl font-black text-lg hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all glow-green hover:glow-green-strong transform hover:scale-105 relative overflow-hidden group"
            >
              <span className="relative z-10">
                {loading 
                  ? (language === 'en' ? 'Verifying...' : 'Verifica...')
                  : (language === 'en' ? 'Verify' : 'Verifica')
                }
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </button>
          </div>

          <div className="flex items-center justify-center pt-2">
            <button
              type="button"
              onClick={sendVerificationCode}
              disabled={sending || countdown > 0}
              className="text-primary-400 hover:text-primary-300 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 group"
            >
              {sending ? (
                <>
                  <span className="w-4 h-4 border-2 border-primary-400 border-t-transparent rounded-full animate-spin"></span>
                  <span>{language === 'en' ? 'Sending...' : 'Invio...'}</span>
                </>
              ) : countdown > 0 ? (
                <>
                  <span>⏱️</span>
                  <span>{language === 'en' ? `Resend in ${countdown}s` : `Reinvia tra ${countdown}s`}</span>
                </>
              ) : (
                <>
                  <span className="group-hover:scale-110 transition-transform">↻</span>
                  <span>{language === 'en' ? 'Resend code' : 'Reinvia codice'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

