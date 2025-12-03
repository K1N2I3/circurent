'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface AddressInputProps {
  value: string;
  onChange: (address: string, details?: any) => void;
  required?: boolean;
}

export default function AddressInput({ value, onChange, required = false }: AddressInputProps) {
  const { language } = useLanguage();
  interface Suggestion {
    description: string;
    placeId: string;
  }
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    if (inputValue.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);
    try {
      // Use our API route to fetch Google Maps suggestions (to keep API key secure)
      const response = await fetch(
        `/api/maps/autocomplete?input=${encodeURIComponent(inputValue)}&language=${language === 'en' ? 'en' : 'it'}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.predictions) {
          const addresses = data.predictions.map((prediction: any) => ({
            description: prediction.description,
            placeId: prediction.place_id,
          }));
          setSuggestions(addresses);
          setShowSuggestions(true);
        }
      }
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    onChange(suggestion.description);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <div className="relative group">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          required={required}
          className="w-full px-5 py-4 bg-[#0a0a0f] border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500/50 transition-all group-hover:border-white/20"
          placeholder={language === 'en' ? 'Start typing your address...' : 'Inizia a digitare il tuo indirizzo...'}
        />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/0 via-primary-500/0 to-primary-500/0 group-hover:from-primary-500/5 group-hover:via-primary-500/10 group-hover:to-primary-500/5 transition-all pointer-events-none"></div>
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-2 glass rounded-2xl border border-white/10 shadow-2xl max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelectSuggestion(suggestion)}
              className="w-full px-5 py-3 text-left text-white hover:bg-white/10 transition-colors border-b border-white/5 last:border-b-0 flex items-center gap-3"
            >
              <span className="text-primary-400">📍</span>
              <span className="flex-1">{suggestion.description}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

