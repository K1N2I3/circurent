'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';
import UserAvatar from '../components/UserAvatar';
import { User, AddressData, getDisplayName } from '@/lib/db';

// Type guard function
function isAddressData(address: any): address is AddressData {
  return (
    address &&
    typeof address === 'object' &&
    'street' in address &&
    'city' in address &&
    'state' in address &&
    'postalCode' in address &&
    'country' in address
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingAvatar, setEditingAvatar] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/user');
      if (!response.ok) {
        router.push('/login');
        return;
      }
      const userData: User = await response.json();
      // Parse address if it's a JSON string
      if (userData.address && typeof userData.address === 'string') {
        try {
          userData.address = JSON.parse(userData.address) as AddressData;
        } catch {
          // If parsing fails, set to undefined
          userData.address = undefined;
        }
      }
      setUser(userData);
      setNewEmail(userData.email);
      setNewName(userData.name || '');
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setAvatarPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const saveAvatar = async () => {
    if (!avatarPreview) return;
    
    setUploading(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/user/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatarUrl: avatarPreview }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || (language === 'en' ? 'Failed to update avatar' : 'Aggiornamento avatar fallito'));
        return;
      }

      setUser(data);
      setEditingAvatar(false);
      setAvatarPreview('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      setError(language === 'en' ? 'Failed to update avatar' : 'Aggiornamento avatar fallito');
    } finally {
      setUploading(false);
    }
  };

  const saveEmail = async () => {
    if (!newEmail || newEmail.trim() === user?.email) {
      setEditingEmail(false);
      return;
    }

    setUploading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/user/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || (language === 'en' ? 'Failed to update email' : 'Aggiornamento email fallito'));
        return;
      }

      setUser(data);
      setEditingEmail(false);
    } catch (error) {
      setError(language === 'en' ? 'Failed to update email' : 'Aggiornamento email fallito');
    } finally {
      setUploading(false);
    }
  };

  const saveName = async () => {
    setUploading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/user/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim() || null }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || (language === 'en' ? 'Failed to update name' : 'Aggiornamento nome fallito'));
        return;
      }

      setUser(data);
      setEditingName(false);
    } catch (error) {
      setError(language === 'en' ? 'Failed to update name' : 'Aggiornamento nome fallito');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 bg-[#0a0a0f]">
        <div className="text-xl text-white">{t.common.loading}</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const locale = language === 'it' ? 'it-IT' : 'en-US';

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-20 pb-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link 
          href="/" 
          className="inline-flex items-center text-gray-400 hover:text-primary-400 mb-8 transition-colors group"
        >
          <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
          <span className="font-semibold">{t.common.back}</span>
        </Link>

        {/* Profile Card */}
        <div className="glass rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
          <div className="bg-gradient-to-r from-primary-500/20 via-primary-500/10 to-transparent p-8 border-b border-white/10">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <UserAvatar name={getDisplayName(user)} avatarUrl={user.avatarUrl} size="lg" />
                {editingAvatar ? (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-white text-xs font-bold px-3 py-1 bg-primary-500 rounded-lg hover:bg-primary-400 transition-colors"
                    >
                      {language === 'en' ? 'Choose' : 'Scegli'}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditingAvatar(true)}
                    className="absolute -bottom-1 -right-1 bg-primary-500 text-white rounded-full p-2 hover:bg-primary-400 transition-colors shadow-lg"
                    title={language === 'en' ? 'Change avatar' : 'Cambia avatar'}
                  >
                    <span className="text-sm">📷</span>
                  </button>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-black text-white mb-2">{getDisplayName(user)}</h1>
                <p className="text-gray-400">{user.email}</p>
                <p className="text-gray-500 text-sm mt-1">@{user.username}</p>
              </div>
            </div>
            {editingAvatar && (
              <div className="mt-6 flex items-center gap-3">
                {avatarPreview && (
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary-500">
                    <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 flex gap-3">
                  <button
                    onClick={saveAvatar}
                    disabled={!avatarPreview || uploading}
                    className="bg-primary-500 text-[#0a0a0f] px-4 py-2 rounded-xl hover:bg-primary-400 transition-all font-black disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading 
                      ? (language === 'en' ? 'Saving...' : 'Salvataggio...')
                      : (language === 'en' ? 'Save' : 'Salva')
                    }
                  </button>
                  <button
                    onClick={() => {
                      setEditingAvatar(false);
                      setAvatarPreview('');
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="bg-gray-700 text-white px-4 py-2 rounded-xl hover:bg-gray-600 transition-all font-black"
                  >
                    {language === 'en' ? 'Cancel' : 'Annulla'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-6 bg-red-500/20 border-2 border-red-500/50 text-red-400 px-5 py-4 rounded-2xl">
                {error}
              </div>
            )}
            <div className="space-y-6">
              {/* Display Name */}
              <div className="glass rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                    {language === 'en' ? 'Display Name' : 'Nome Visualizzato'}
                  </div>
                  {!editingName && (
                    <button
                      onClick={() => {
                        setEditingName(true);
                        setNewName(user.name || '');
                      }}
                      className="text-primary-400 hover:text-primary-300 text-sm font-bold transition-colors"
                    >
                      {language === 'en' ? 'Edit' : 'Modifica'}
                    </button>
                  )}
                </div>
                {editingName ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500/50 transition-all"
                      placeholder={language === 'en' ? 'Enter display name (optional)' : 'Inserisci nome visualizzato (opzionale)'}
                    />
                    <div className="text-xs text-gray-500 mb-3">
                      {language === 'en' 
                        ? 'Leave empty to use username as display name'
                        : 'Lascia vuoto per usare il nome utente come nome visualizzato'
                      }
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={saveName}
                        disabled={uploading}
                        className="bg-primary-500 text-[#0a0a0f] px-4 py-2 rounded-xl hover:bg-primary-400 transition-all font-black disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {uploading 
                          ? (language === 'en' ? 'Saving...' : 'Salvataggio...')
                          : (language === 'en' ? 'Save' : 'Salva')
                        }
                      </button>
                      <button
                        onClick={() => {
                          setEditingName(false);
                          setNewName(user.name || '');
                        }}
                        className="bg-gray-700 text-white px-4 py-2 rounded-xl hover:bg-gray-600 transition-all font-black"
                      >
                        {language === 'en' ? 'Cancel' : 'Annulla'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-white font-semibold text-lg">
                    {getDisplayName(user)}
                    {!user.name && (
                      <span className="text-gray-500 text-sm ml-2">
                        ({language === 'en' ? 'using username' : 'usa nome utente'})
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Username (read-only) */}
              <div className="glass rounded-2xl p-6 border border-white/10">
                <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">
                  {language === 'en' ? 'Username' : 'Nome Utente'}
                </div>
                <div className="text-white font-semibold text-lg">@{user.username}</div>
                <div className="text-gray-500 text-sm mt-1">
                  {language === 'en' ? 'Cannot be changed' : 'Non può essere modificato'}
                </div>
              </div>

              {/* Email */}
              <div className="glass rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                    {language === 'en' ? 'Email Address' : 'Indirizzo Email'}
                  </div>
                  {!editingEmail && (
                    <button
                      onClick={() => setEditingEmail(true)}
                      className="text-primary-400 hover:text-primary-300 text-sm font-bold transition-colors"
                    >
                      {language === 'en' ? 'Edit' : 'Modifica'}
                    </button>
                  )}
                </div>
                {editingEmail ? (
                  <div className="space-y-3">
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500/50 transition-all"
                      placeholder={language === 'en' ? 'Enter new email' : 'Inserisci nuova email'}
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={saveEmail}
                        disabled={uploading || !newEmail.trim() || newEmail.trim() === user.email}
                        className="bg-primary-500 text-[#0a0a0f] px-4 py-2 rounded-xl hover:bg-primary-400 transition-all font-black disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {uploading 
                          ? (language === 'en' ? 'Saving...' : 'Salvataggio...')
                          : (language === 'en' ? 'Save' : 'Salva')
                        }
                      </button>
                      <button
                        onClick={() => {
                          setEditingEmail(false);
                          setNewEmail(user.email);
                        }}
                        className="bg-gray-700 text-white px-4 py-2 rounded-xl hover:bg-gray-600 transition-all font-black"
                      >
                        {language === 'en' ? 'Cancel' : 'Annulla'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-white font-semibold text-lg">{user.email}</div>
                )}
              </div>

              {/* Address */}
              <div className="glass rounded-2xl p-6 border border-white/10">
                <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">
                  {language === 'en' ? 'Address' : 'Indirizzo'}
                </div>
                <div className="text-white font-semibold text-lg">
                  {(() => {
                    if (!user.address) {
                      return language === 'en' ? 'Not provided' : 'Non fornito';
                    }
                    
                    const address = user.address;
                    if (isAddressData(address)) {
                      return (
                        <div className="space-y-1">
                          <div>{address.street}</div>
                          <div className="text-gray-400 text-sm">
                            {address.city}, {address.state} {address.postalCode}
                          </div>
                          <div className="text-gray-400 text-sm">{address.country}</div>
                        </div>
                      );
                    }
                    
                    // Fallback for old string format
                    return String(address);
                  })()}
                </div>
              </div>

              {/* Member Since */}
              <div className="glass rounded-2xl p-6 border border-white/10">
                <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">
                  {language === 'en' ? 'Member Since' : 'Membro Dal'}
                </div>
                <div className="text-white font-semibold text-lg">
                  {new Date(user.createdAt).toLocaleDateString(locale, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

