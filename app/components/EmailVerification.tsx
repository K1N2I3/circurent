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
        <label className="block text-sm font-black text-gray-300 mb-3 uppercase tracking-wider">
          {language === 'en' ? 'Email Verification' : 'Verifica Email'}
        </label>
        <p className="text-gray-400 text-sm mb-4">
          {language === 'en' 
            ? `We've sent a verification code to ${email}. Please check your inbox and enter the code below.`
            : `Abbiamo inviato un codice di verifica a ${email}. Controlla la tua casella di posta e inserisci il codice qui sotto.`
          }
        </p>

        {error && (
          <div className="bg-red-500/20 border-2 border-red-500/50 text-red-400 px-5 py-4 rounded-2xl mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-primary-500/20 border-2 border-primary-500/50 text-primary-400 px-5 py-4 rounded-2xl mb-4">
            {success}
          </div>
        )}

        <div className="flex gap-3">
          <input
            type="text"
            value={code}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 6);
              setCode(value);
              setError('');
            }}
            className="flex-1 px-5 py-4 bg-[#0a0a0f] border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500/50 transition-all text-center text-2xl font-black tracking-widest"
            placeholder="000000"
            maxLength={6}
          />
          <button
            type="button"
            onClick={verifyCode}
            disabled={loading || code.length !== 6}
            className="px-8 py-4 bg-primary-500 text-[#0a0a0f] rounded-2xl font-black hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 transition-all glow-green hover:glow-green-strong"
          >
            {loading 
              ? (language === 'en' ? 'Verifying...' : 'Verifica...')
              : (language === 'en' ? 'Verify' : 'Verifica')
            }
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={sendVerificationCode}
            disabled={sending || countdown > 0}
            className="text-primary-400 hover:text-primary-300 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {sending
              ? (language === 'en' ? 'Sending...' : 'Invio...')
              : countdown > 0
              ? (language === 'en' ? `Resend in ${countdown}s` : `Reinvia tra ${countdown}s`)
              : (language === 'en' ? 'Resend code' : 'Reinvia codice')
            }
          </button>
        </div>
      </div>
    </div>
  );
}

