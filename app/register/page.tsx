'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';
import AddressForm, { AddressData } from '../components/AddressForm';
import EmailVerification from '../components/EmailVerification';

type Step = 1 | 2 | 3;

export default function RegisterPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    } as AddressData,
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [addressValid, setAddressValid] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError(language === 'en' ? 'Please enter your name' : 'Inserisci il tuo nome');
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError(language === 'en' ? 'Please enter a valid email address' : 'Inserisci un indirizzo email valido');
      return;
    }

    if (formData.password.length < 6) {
      setError(t.auth.passwordTooShort);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t.auth.passwordMismatch);
      return;
    }

    setStep(2);
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.address.street.trim()) {
      setError(language === 'en' ? 'Please enter your street address' : 'Inserisci il tuo indirizzo');
      return;
    }

    if (!formData.address.city.trim()) {
      setError(language === 'en' ? 'Please enter your city' : 'Inserisci la tua città');
      return;
    }

    if (!formData.address.state.trim()) {
      setError(language === 'en' ? 'Please enter your state/province' : 'Inserisci la tua regione/provincia');
      return;
    }

    if (!formData.address.postalCode.trim()) {
      setError(language === 'en' ? 'Please enter your postal code' : 'Inserisci il tuo codice postale');
      return;
    }

    if (!formData.address.country.trim()) {
      setError(language === 'en' ? 'Please select your country' : 'Seleziona il tuo paese');
      return;
    }

    // Only proceed if address is validated
    if (!addressValid) {
      setError(language === 'en' ? 'Please wait for address validation' : 'Attendi la validazione dell\'indirizzo');
      return;
    }

    setStep(3);
  };

  const handleStep3 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!emailVerified) {
      setError(language === 'en' ? 'Please verify your email first' : 'Verifica prima la tua email');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          address: formData.address,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || t.auth.registerError);
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
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] pt-20 px-4 py-12 relative overflow-hidden">
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
            Create <span className="gradient-text animate-gradient">Account</span>
          </h2>
          <p className="text-gray-400 text-lg animate-slide-up mb-6">
            {t.auth.noAccount}{' '}
            <Link href="/login" className="text-primary-500 hover:text-primary-400 font-bold transition-colors">
              {t.nav.login}
            </Link>
          </p>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-black transition-all ${
                    step >= s
                      ? 'bg-primary-500 text-[#0a0a0f] glow-green'
                      : 'bg-white/10 text-gray-400'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-12 h-1 mx-2 transition-all ${
                      step > s ? 'bg-primary-500' : 'bg-white/10'
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <form
          className="glass rounded-3xl p-10 border border-white/10 shadow-2xl backdrop-blur-xl animate-scale-in"
          onSubmit={step === 1 ? handleStep1 : step === 2 ? handleStep2 : handleStep3}
        >
          {error && (
            <div className="bg-red-500/20 border-2 border-red-500/50 text-red-400 px-5 py-4 rounded-2xl mb-6">
              {error}
            </div>
          )}

          {/* Step 1: Name, Email and Password */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-black text-white mb-2">
                  {language === 'en' ? 'Step 1: Your Information' : 'Passo 1: Le Tue Informazioni'}
                </h3>
                <p className="text-gray-400 text-sm">
                  {language === 'en' ? 'Let\'s start with your name, email and password' : 'Iniziamo con il tuo nome, email e password'}
                </p>
              </div>

              <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <label htmlFor="name" className="block text-sm font-black text-gray-300 mb-3 uppercase tracking-wider">
                  {t.auth.name}
                </label>
                <div className="relative group">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-5 py-4 bg-[#0a0a0f] border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500/50 transition-all group-hover:border-white/20"
                    placeholder={t.auth.name}
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/0 via-primary-500/0 to-primary-500/0 group-hover:from-primary-500/5 group-hover:via-primary-500/10 group-hover:to-primary-500/5 transition-all pointer-events-none"></div>
                </div>
              </div>

              <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
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

              <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <label htmlFor="password" className="block text-sm font-black text-gray-300 mb-3 uppercase tracking-wider">
                  {t.auth.password}
                </label>
                <div className="relative group">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-5 py-4 bg-[#0a0a0f] border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500/50 transition-all group-hover:border-white/20"
                    placeholder={t.auth.password}
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/0 via-primary-500/0 to-primary-500/0 group-hover:from-primary-500/5 group-hover:via-primary-500/10 group-hover:to-primary-500/5 transition-all pointer-events-none"></div>
                </div>
              </div>

              <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <label htmlFor="confirmPassword" className="block text-sm font-black text-gray-300 mb-3 uppercase tracking-wider">
                  {t.auth.confirmPassword}
                </label>
                <div className="relative group">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full px-5 py-4 bg-[#0a0a0f] border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500/50 transition-all group-hover:border-white/20"
                    placeholder={t.auth.confirmPassword}
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/0 via-primary-500/0 to-primary-500/0 group-hover:from-primary-500/5 group-hover:via-primary-500/10 group-hover:to-primary-500/5 transition-all pointer-events-none"></div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-5 px-4 bg-primary-500 text-[#0a0a0f] rounded-2xl font-black text-lg hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all glow-green hover:glow-green-strong transform hover:scale-[1.02] relative overflow-hidden group animate-fade-in"
                style={{ animationDelay: '0.5s' }}
              >
                <span className="relative z-10">
                  {language === 'en' ? 'Next Step' : 'Passo Successivo'} →
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </button>
            </div>
          )}

          {/* Step 2: Address */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-black text-white mb-2">
                  {language === 'en' ? 'Step 2: Your Address' : 'Passo 2: Il Tuo Indirizzo'}
                </h3>
                <p className="text-gray-400 text-sm">
                  {language === 'en' ? 'Enter your shipping address' : 'Inserisci il tuo indirizzo di spedizione'}
                </p>
              </div>

              <div className="animate-fade-in">
                <AddressForm
                  value={formData.address}
                  onChange={(address) => {
                    setFormData({ ...formData, address });
                    // Reset validation when address changes
                    setAddressValid(false);
                  }}
                  onValidationChange={(isValid) => {
                    setAddressValid(isValid);
                  }}
                  required
                />
              </div>

              <div className="flex gap-4 mt-8 relative z-10">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setAddressValid(false);
                  }}
                  className="flex-1 py-5 px-4 glass border border-white/10 text-white rounded-2xl font-black text-lg hover:bg-white/10 transition-all"
                >
                  ← {language === 'en' ? 'Back' : 'Indietro'}
                </button>
                <button
                  type="submit"
                  disabled={!addressValid}
                  className={`flex-1 py-5 px-4 rounded-2xl font-black text-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all relative overflow-hidden group ${
                    addressValid
                      ? 'bg-primary-500 text-[#0a0a0f] hover:bg-primary-400 glow-green hover:glow-green-strong transform hover:scale-[1.02]'
                      : 'bg-gray-600/30 text-gray-500 cursor-not-allowed opacity-50'
                  }`}
                >
                  <span className="relative z-10">
                    {language === 'en' ? 'Next Step' : 'Passo Successivo'} →
                  </span>
                  {addressValid && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Email Verification */}
          {step === 3 && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-black text-white mb-3">
                  {language === 'en' ? 'Step 3: Verify Your Email' : 'Passo 3: Verifica la Tua Email'}
                </h3>
                <p className="text-gray-400 text-base">
                  {language === 'en' ? 'Please verify your email address to complete registration' : 'Verifica il tuo indirizzo email per completare la registrazione'}
                </p>
              </div>

              <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <EmailVerification email={formData.email} onVerify={setEmailVerified} />
              </div>

              {emailVerified && (
                <div className="animate-fade-in bg-primary-500/10 border-2 border-primary-500/30 rounded-2xl p-5 text-center">
                  <div className="flex items-center justify-center gap-3 text-primary-400">
                    <span className="text-2xl">✅</span>
                    <span className="font-black text-lg">
                      {language === 'en' ? 'Email verified! You can now complete registration.' : 'Email verificata! Ora puoi completare la registrazione.'}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-4 mt-10">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 py-5 px-4 glass border border-white/10 text-white rounded-2xl font-black text-lg hover:bg-white/10 transition-all"
                >
                  ← {language === 'en' ? 'Back' : 'Indietro'}
                </button>
                <button
                  type="submit"
                  disabled={loading || !emailVerified}
                  className="flex-1 py-5 px-4 bg-primary-500 text-[#0a0a0f] rounded-2xl font-black text-lg hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all glow-green hover:glow-green-strong transform hover:scale-[1.02] relative overflow-hidden group"
                >
                  <span className="relative z-10">
                    {loading ? t.common.loading : t.auth.registerButton}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
