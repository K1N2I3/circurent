'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface CaptchaProps {
  onVerify: (isValid: boolean) => void;
}

export default function Captcha({ onVerify }: CaptchaProps) {
  const { t, language } = useLanguage();
  const [code, setCode] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isValid, setIsValid] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    generateCode();
  }, []);

  useEffect(() => {
    if (userInput.length === code.length) {
      const valid = userInput.toLowerCase() === code.toLowerCase();
      setIsValid(valid);
      onVerify(valid);
    } else {
      setIsValid(false);
      onVerify(false);
    }
  }, [userInput, code, onVerify]);

  const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let newCode = '';
    for (let i = 0; i < 5; i++) {
      newCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCode(newCode);
    setUserInput('');
    setIsValid(false);
    drawCode(newCode);
  };

  const drawCode = (text: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#0a0a0f');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add noise lines
    ctx.strokeStyle = 'rgba(132, 204, 22, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // Draw text with rotation and distortion
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const x = (canvas.width / (text.length + 1)) * (i + 1);
      const y = canvas.height / 2;

      // Random rotation
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((Math.random() - 0.5) * 0.4);
      
      // Random color
      const hue = 120 + Math.random() * 40; // Green range
      ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
      
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-black text-gray-300 mb-3 uppercase tracking-wider">
        {language === 'en' ? 'Verification Code' : 'Codice di Verifica'}
      </label>
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <canvas
            ref={canvasRef}
            width={200}
            height={60}
            className="glass rounded-xl border border-white/10 cursor-pointer hover:border-primary-500/50 transition-all"
            onClick={generateCode}
            title={language === 'en' ? 'Click to refresh' : 'Clicca per aggiornare'}
          />
          <button
            type="button"
            onClick={generateCode}
            className="absolute -right-2 -top-2 bg-primary-500 text-[#0a0a0f] p-2 rounded-full hover:bg-primary-400 transition-all transform hover:rotate-180"
            title={language === 'en' ? 'Refresh code' : 'Aggiorna codice'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value.toUpperCase())}
          maxLength={5}
          className="flex-1 px-5 py-4 bg-[#0a0a0f] border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-center text-2xl font-black tracking-widest uppercase"
          placeholder="XXXXX"
        />
      </div>
      {userInput.length > 0 && (
        <div className={`text-sm font-bold ${isValid ? 'text-primary-400' : 'text-red-400'}`}>
          {isValid 
            ? (language === 'en' ? '✓ Verification code is correct' : '✓ Codice di verifica corretto')
            : (language === 'en' ? '✗ Verification code is incorrect' : '✗ Codice di verifica errato')
          }
        </div>
      )}
      <p className="text-xs text-gray-500">
        {language === 'en' ? 'Click on the code to refresh' : 'Clicca sul codice per aggiornare'}
      </p>
    </div>
  );
}

