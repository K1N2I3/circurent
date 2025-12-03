'use client';

import { useState, useEffect, useRef } from 'react';
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
  onValidationChange?: (isValid: boolean) => void;
  required?: boolean;
}

type ValidationStatus = 'idle' | 'validating' | 'valid' | 'invalid';

export default function AddressForm({ value, onChange, onValidationChange, required = false }: AddressFormProps) {
  const { language } = useLanguage();
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>('idle');
  const [validationMessage, setValidationMessage] = useState<string>('');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (field: keyof AddressData, newValue: string) => {
    onChange({
      ...value,
      [field]: newValue,
    });
    
    // Reset validation status when user changes address
    if (validationStatus !== 'idle') {
      setValidationStatus('idle');
      setValidationMessage('');
    }
  };

  // Validate address using OpenStreetMap Nominatim API
  const validateAddress = async () => {
    // Check if we have enough information to validate
    if (!value.street.trim() || !value.city.trim() || !value.country) {
      setValidationStatus('invalid');
      setValidationMessage(language === 'en' 
        ? 'Please fill in street, city, and country' 
        : 'Compila via, città e paese');
      return;
    }

    setValidationStatus('validating');
    setValidationMessage(language === 'en' ? 'Validating address...' : 'Validazione indirizzo...');

    try {
      // Build address query
      const addressQuery = [
        value.street,
        value.city,
        value.state,
        value.postalCode,
        value.country,
      ].filter(Boolean).join(', ');

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressQuery)}&limit=1&addressdetails=1&accept-language=${language === 'en' ? 'en' : 'it'}`,
        {
          headers: {
            'User-Agent': 'CircuRent/1.0',
            'Accept': 'application/json',
          },
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        
        if (data && data.length > 0) {
          // Address found - validate and optionally auto-fill missing fields
          const result = data[0];
          const address = result.address || {};
          
          // Auto-fill missing fields if available
          const updatedAddress: AddressData = { ...value };
          let hasUpdates = false;
          
          if (!updatedAddress.city && (address.city || address.town || address.village)) {
            updatedAddress.city = address.city || address.town || address.village;
            hasUpdates = true;
          }
          
          if (!updatedAddress.state && (address.state || address.region || address.province)) {
            updatedAddress.state = address.state || address.region || address.province;
            hasUpdates = true;
          }
          
          if (!updatedAddress.postalCode && address.postcode) {
            updatedAddress.postalCode = address.postcode;
            hasUpdates = true;
          }
          
          if (!updatedAddress.country && address.country_code) {
            const countryCode = address.country_code.toUpperCase();
            updatedAddress.country = countryCode;
            hasUpdates = true;
          }
          
          if (hasUpdates) {
            onChange(updatedAddress);
          }
          
          setValidationStatus('valid');
          setValidationMessage(language === 'en' 
            ? 'Address verified' 
            : 'Indirizzo verificato');
          
          // Notify parent component that address is valid
          if (onValidationChange) {
            onValidationChange(true);
          }
        } else {
          setValidationStatus('invalid');
          setValidationMessage(language === 'en' 
            ? 'Invalid address' 
            : 'Indirizzo non valido');
          
          // Notify parent component that address is invalid
          if (onValidationChange) {
            onValidationChange(false);
          }
        }
      } else {
        setValidationStatus('invalid');
        setValidationMessage(language === 'en' 
          ? 'Invalid address' 
          : 'Indirizzo non valido');
        
        if (onValidationChange) {
          onValidationChange(false);
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        setValidationStatus('invalid');
        setValidationMessage(language === 'en' 
          ? 'Invalid address' 
          : 'Indirizzo non valido');
      } else {
        setValidationStatus('invalid');
        setValidationMessage(language === 'en' 
          ? 'Invalid address' 
          : 'Indirizzo non valido');
      }
      
      if (onValidationChange) {
        onValidationChange(false);
      }
    }
  };

  // Auto-validate when user has filled enough fields (debounced)
  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Only auto-validate if we have enough information
    const hasEnoughInfo = value.street.trim().length >= 5 && 
                         value.city.trim().length >= 2 && 
                         value.country.length === 2;

    if (hasEnoughInfo && validationStatus === 'idle') {
      // Debounce: wait 2 seconds after user stops typing
      debounceTimerRef.current = setTimeout(() => {
        validateAddress();
      }, 2000);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [value.street, value.city, value.country]);

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
      {/* Address Validation Status - Display at top */}
      {validationStatus !== 'idle' && (
        <div className={`rounded-2xl p-4 border-2 transition-all ${
          validationStatus === 'validating' 
            ? 'bg-blue-500/10 border-blue-500/30' 
            : validationStatus === 'valid'
            ? 'bg-green-500/10 border-green-500/30'
            : 'bg-red-500/10 border-red-500/30'
        }`}>
          <div className="flex items-center gap-3">
            {validationStatus === 'validating' && (
              <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            )}
            {validationStatus === 'valid' && (
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-white text-xs font-black">✓</span>
              </div>
            )}
            {validationStatus === 'invalid' && (
              <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                <span className="text-white text-xs font-black">✗</span>
              </div>
            )}
            <p className={`text-sm font-semibold ${
              validationStatus === 'validating' 
                ? 'text-blue-400' 
                : validationStatus === 'valid'
                ? 'text-green-400'
                : 'text-red-400'
            }`}>
              {validationMessage}
            </p>
          </div>
        </div>
      )}

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

