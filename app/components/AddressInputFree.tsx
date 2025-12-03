'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface AddressInputProps {
  value: string;
  onChange: (address: string, details?: any) => void;
  required?: boolean;
}

export default function AddressInputFree({ value, onChange, required = false }: AddressInputProps) {
  const { language } = useLanguage();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      // 清理防抖定时器
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const fetchAddressSuggestions = async (inputValue: string) => {
    if (inputValue.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);
    try {
      // 创建 AbortController 用于超时控制
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒超时

      // 使用免费的 OpenStreetMap Nominatim API
      // 添加延迟以避免请求太频繁（Nominatim 限制每秒 1 次请求）
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(inputValue)}&limit=3&addressdetails=1&accept-language=${language === 'en' ? 'en' : 'it'}`,
        {
          headers: {
            'User-Agent': 'CircuRent/1.0', // Required by Nominatim
            'Accept': 'application/json',
          },
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const addresses = data.map((item: any) => {
            // 格式化地址显示
            const parts = [];
            if (item.address) {
              if (item.address.road) parts.push(item.address.road);
              if (item.address.house_number) parts.push(item.address.house_number);
              if (item.address.city || item.address.town || item.address.village) {
                parts.push(item.address.city || item.address.town || item.address.village);
              }
              if (item.address.country) parts.push(item.address.country);
            }
            return {
              display: parts.length > 0 ? parts.join(', ') : item.display_name,
              full: item.display_name,
              lat: item.lat,
              lon: item.lon,
              raw: item
            };
          });
          setSuggestions(addresses);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } else {
        // 处理 HTTP 错误
        if (response.status === 429) {
          console.warn('Too many requests to Nominatim. Please wait a moment.');
        }
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error: any) {
      // 静默处理错误，避免控制台噪音
      if (error.name !== 'AbortError' && error.name !== 'TimeoutError') {
        // 只记录非超时错误
        console.warn('Address search temporarily unavailable. You can still type your address manually.');
      }
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    // 清除之前的防抖定时器
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // 如果输入太短，立即清除建议
    if (inputValue.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // 防抖：等待用户停止输入 500ms 后再发送请求
    debounceTimerRef.current = setTimeout(() => {
      fetchAddressSuggestions(inputValue);
    }, 500);
  };

  const handleSelectSuggestion = (suggestion: any) => {
    onChange(suggestion.full || suggestion.display);
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
          className="absolute z-50 w-full mt-2 glass rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
          style={{ 
            maxHeight: '8rem',
            maxWidth: '100%'
          }}
        >
          <div className="max-h-32 overflow-y-auto">
            {suggestions.map((suggestion: any, index: number) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelectSuggestion(suggestion)}
                className="w-full px-5 py-2.5 text-left text-white hover:bg-white/10 transition-colors border-b border-white/5 last:border-b-0 flex items-center gap-3"
              >
                <span className="text-primary-400 text-sm">📍</span>
                <span className="flex-1 text-sm truncate">{suggestion.display || suggestion.full}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

