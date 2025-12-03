'use client';

import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export interface AddressData {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface AddressFormProps {
  value: AddressData;
  onChange: (address: AddressData) => void;
  required?: boolean;
}

export default function AddressForm({ value, onChange, required = false }: AddressFormProps) {
  const { language } = useLanguage();

  const handleChange = (field: keyof AddressData, newValue: string) => {
    onChange({
      ...value,
      [field]: newValue,
    });
  };

  const countries = [
    { code: 'IT', name: language === 'en' ? 'Italy' : 'Italia' },
    { code: 'US', name: language === 'en' ? 'United States' : 'Stati Uniti' },
    { code: 'GB', name: language === 'en' ? 'United Kingdom' : 'Regno Unito' },
    { code: 'DE', name: language === 'en' ? 'Germany' : 'Germania' },
    { code: 'FR', name: language === 'en' ? 'France' : 'Francia' },
    { code: 'ES', name: language === 'en' ? 'Spain' : 'Spagna' },
    { code: 'NL', name: language === 'en' ? 'Netherlands' : 'Paesi Bassi' },
    { code: 'BE', name: language === 'en' ? 'Belgium' : 'Belgio' },
    { code: 'CH', name: language === 'en' ? 'Switzerland' : 'Svizzera' },
    { code: 'AT', name: language === 'en' ? 'Austria' : 'Austria' },
    { code: 'PT', name: language === 'en' ? 'Portugal' : 'Portogallo' },
    { code: 'GR', name: language === 'en' ? 'Greece' : 'Grecia' },
  ];

  return (
    <div className="space-y-5">
      {/* Country */}
      <div>
        <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">
          {language === 'en' ? 'Country' : 'Paese'} {required && '*'}
        </label>
        <select
          value={value.country}
          onChange={(e) => handleChange('country', e.target.value)}
          required={required}
          className="w-full px-5 py-4 bg-[#0a0a0f] border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500/50 transition-all hover:border-white/20"
        >
          <option value="">{language === 'en' ? 'Select Country' : 'Seleziona Paese'}</option>
          {countries.map((country) => (
            <option key={country.code} value={country.code} className="bg-[#0a0a0f]">
              {country.name}
            </option>
          ))}
        </select>
      </div>

      {/* Street Address */}
      <div>
        <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">
          {language === 'en' ? 'Street Address' : 'Indirizzo'} {required && '*'}
        </label>
        <input
          type="text"
          value={value.street}
          onChange={(e) => handleChange('street', e.target.value)}
          required={required}
          placeholder={language === 'en' ? 'Street name and number' : 'Via e numero civico'}
          className="w-full px-5 py-4 bg-[#0a0a0f] border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500/50 transition-all hover:border-white/20"
        />
      </div>

      {/* City and State in one row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* City */}
        <div>
          <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">
            {language === 'en' ? 'City' : 'Città'} {required && '*'}
          </label>
          <input
            type="text"
            value={value.city}
            onChange={(e) => handleChange('city', e.target.value)}
            required={required}
            placeholder={language === 'en' ? 'City' : 'Città'}
            className="w-full px-5 py-4 bg-[#0a0a0f] border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500/50 transition-all hover:border-white/20"
          />
        </div>

        {/* State/Province */}
        <div>
          <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">
            {language === 'en' ? 'State / Province' : 'Regione / Provincia'} {required && '*'}
          </label>
          <input
            type="text"
            value={value.state}
            onChange={(e) => handleChange('state', e.target.value)}
            required={required}
            placeholder={language === 'en' ? 'State or Province' : 'Regione o Provincia'}
            className="w-full px-5 py-4 bg-[#0a0a0f] border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500/50 transition-all hover:border-white/20"
          />
        </div>
      </div>

      {/* Postal Code */}
      <div>
        <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">
          {language === 'en' ? 'Postal Code' : 'Codice Postale'} {required && '*'}
        </label>
        <input
          type="text"
          value={value.postalCode}
          onChange={(e) => handleChange('postalCode', e.target.value)}
          required={required}
          placeholder={language === 'en' ? 'Postal Code' : 'Codice Postale'}
          className="w-full px-5 py-4 bg-[#0a0a0f] border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500/50 transition-all hover:border-white/20"
        />
      </div>
    </div>
  );
}

