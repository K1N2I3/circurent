'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useRouter } from 'next/navigation';

interface EmailVerificationProps {
  email: string;
  onVerify: (isVerified: boolean) => void;
  onComplete?: () => void;
}

export default function EmailVerification({ email, onVerify, onComplete }: EmailVerificationProps) {
  const { language } = useLanguage();
  const router = useRouter();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const verifyingRef = useRef(false);

  // Auto-verify when code reaches 6 digits
  useEffect(() => {
    if (code.length === 6 && !verifyingRef.current && !loading) {
      verifyCode();
    }
  }, [code]);

  const sendVerificationCode = async () => {
    setSending(true);
    setError('');

    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send');
      }

      // Reset code input
      setCode('');
    } catch (error) {
      setError(language === 'en' ? 'Failed to send verification code' : 'Invio codice di verifica fallito');
    } finally {
      setSending(false);
    }
  };

  const verifyCode = async () => {
    if (code.length !== 6 || verifyingRef.current) {
      return;
    }

    verifyingRef.current = true;
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
        // Invalid code - auto resend
        setError(language === 'en' ? 'Invalid code. Resending...' : 'Codice non valido. Reinvio...');
        onVerify(false);
        
        // Auto resend after short delay
        setTimeout(() => {
          sendVerificationCode();
        }, 1000);
        
        verifyingRef.current = false;
        setLoading(false);
        return;
      }

      // Verification successful
      setVerified(true);
      onVerify(true);
      
      // Auto-complete registration and redirect after short delay
      if (onComplete) {
        setTimeout(() => {
          onComplete();
        }, 800);
      } else {
        // If no onComplete callback, redirect directly to home
        setTimeout(() => {
          window.location.href = '/';
        }, 800);
      }
    } catch (error) {
      setError(language === 'en' ? 'Verification failed. Resending...' : 'Verifica fallita. Reinvio...');
      onVerify(false);
      
      // Auto resend on error
      setTimeout(() => {
        sendVerificationCode();
      }, 1000);
      
      verifyingRef.current = false;
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-send verification code when component mounts
    sendVerificationCode();
  }, []);

  return (
    <div className="space-y-6">
      <div className="mb-6 p-5 glass rounded-2xl border border-white/10">
        <p className="text-gray-300 text-sm">
          {language === 'en' 
            ? `Verification code sent to` 
            : `Codice di verifica inviato a`
          }
        </p>
        <p className="text-primary-400 font-bold text-base mt-1 break-all">
          {email}
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {(loading || verified) && (
        <div className={`px-4 py-3 rounded-xl text-sm text-center ${
          verified 
            ? 'bg-green-500/10 border border-green-500/30 text-green-400' 
            : 'bg-blue-500/10 border border-blue-500/30 text-blue-400'
        }`}>
          {verified 
            ? (language === 'en' ? 'Verified' : 'Verificato')
            : (language === 'en' ? 'Verifying...' : 'Verifica in corso...')
          }
        </div>
      )}

      <div className="relative group">
        <input
          type="text"
          value={code}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
            setCode(value);
            setError('');
          }}
          className={`w-full px-6 py-5 bg-[#0a0a0f] border-2 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 transition-all text-center text-3xl font-black tracking-[0.5em] group-hover:border-white/20 ${
            verified 
              ? 'border-green-500/50 focus:ring-green-500 focus:border-green-500/50' 
              : 'border-white/10 focus:ring-primary-500 focus:border-primary-500/50'
          }`}
          placeholder="000000"
          maxLength={6}
          autoFocus
          disabled={loading || sending || verified}
        />
      </div>
    </div>
  );
}

