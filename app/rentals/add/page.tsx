'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../contexts/LanguageContext';
import Link from 'next/link';

const categories = [
  'Electronics',
  'Sports Equipment',
  'Outdoor Gear',
  'Tools',
  'Instruments',
  'Vehicles',
];

export default function AddItemPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Electronics',
    pricePerDay: '',
    imageUrl: '',
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setFormData({ ...formData, imageUrl: result });
      
      // Auto-analyze image with AI
      analyzeImage(result);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (imageUrl: string) => {
    setAnalyzing(true);
    setError('');

    try {
      const response = await fetch('/api/ai/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl }),
      });

      const data = await response.json();
      if (response.ok) {
        setAiSuggestion(data);
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const acceptAiSuggestion = () => {
    if (aiSuggestion) {
      setFormData({
        ...formData,
        name: aiSuggestion.name || formData.name,
        description: aiSuggestion.description || formData.description,
        category: aiSuggestion.category || formData.category,
      });
      setAiSuggestion(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.name || !formData.description || !formData.pricePerDay) {
      setError(language === 'en' ? 'Please fill in all required fields' : 'Compila tutti i campi obbligatori');
      setLoading(false);
      return;
    }

    if (Number(formData.pricePerDay) <= 0) {
      setError(language === 'en' ? 'Price must be greater than 0' : 'Il prezzo deve essere maggiore di 0');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/items/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          pricePerDay: Number(formData.pricePerDay),
          available: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Show detailed error message
        const errorMsg = data.error || (language === 'en' ? 'Failed to create item' : 'Creazione articolo fallita');
        const details = data.details ? ` (${data.details})` : '';
        setError(`${errorMsg}${details}`);
        setLoading(false);
        return;
      }

      // Success - redirect to My Rentals
      router.push('/rentals');
    } catch (error) {
      setError(language === 'en' ? 'Failed to create item' : 'Creazione articolo fallita');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-20 pb-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link 
          href="/rentals" 
          className="inline-flex items-center text-gray-400 hover:text-primary-400 mb-8 transition-colors group"
        >
          <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
          <span className="font-semibold">{language === 'en' ? 'Back to My Rentals' : 'Torna ai Miei Noleggi'}</span>
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
            {language === 'en' ? 'Add ' : 'Aggiungi '}
            <span className="gradient-text">{language === 'en' ? 'New Item' : 'Nuovo Articolo'}</span>
          </h1>
          <p className="text-gray-400 text-xl">
            {language === 'en' 
              ? 'List your item for rent and start earning'
              : 'Elenca il tuo articolo in affitto e inizia a guadagnare'
            }
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 border border-white/10">
          {error && (
            <div className="bg-red-500/20 border-2 border-red-500/50 text-red-400 px-5 py-4 rounded-2xl mb-6">
              {error}
            </div>
          )}

          {/* Image Upload */}
          <div className="mb-8">
            <label className="block text-sm font-black text-gray-300 mb-3 uppercase tracking-wider">
              {language === 'en' ? 'Item Image' : 'Immagine Articolo'} *
            </label>
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-video bg-[#0a0a0f] border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center hover:border-primary-500/50 transition-colors group"
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-contain rounded-2xl" />
                ) : (
                  <div className="text-center">
                    <div className="text-4xl mb-2">📷</div>
                    <div className="text-gray-400 group-hover:text-primary-400 transition-colors">
                      {language === 'en' ? 'Click to upload image' : 'Clicca per caricare immagine'}
                    </div>
                  </div>
                )}
              </button>
              {analyzing && (
                <div className="text-primary-400 text-sm text-center">
                  {language === 'en' ? 'Analyzing image with AI...' : 'Analisi immagine con AI...'}
                </div>
              )}
            </div>
          </div>

          {/* AI Suggestion */}
          {aiSuggestion && (
            <div className="mb-6 bg-primary-500/10 border-2 border-primary-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">✨</span>
                <div className="text-primary-400 font-black text-lg">
                  {language === 'en' ? 'AI Suggestion' : 'Suggerimento AI'}
                </div>
              </div>
              
              <div className="space-y-4 mb-5">
                <div>
                  <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                    {language === 'en' ? 'Name' : 'Nome'}
                  </div>
                  <div className="text-white font-semibold text-base">
                    {aiSuggestion.name || (language === 'en' ? 'Item' : 'Articolo')}
                  </div>
                </div>
                
                <div>
                  <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                    {language === 'en' ? 'Description' : 'Descrizione'}
                  </div>
                  <div className="text-gray-300 text-sm leading-relaxed">
                    {aiSuggestion.description || (language === 'en' ? 'A rental item. Please provide more details.' : 'Un articolo in affitto. Fornisci maggiori dettagli.')}
                  </div>
                </div>
                
                <div>
                  <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                    {language === 'en' ? 'Category' : 'Categoria'}
                  </div>
                  <div className="inline-block px-3 py-1 bg-primary-500/20 border border-primary-500/30 rounded-lg">
                    <span className="text-primary-400 font-semibold text-sm">
                      {aiSuggestion.category || 'Electronics'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4 border-t border-primary-500/20">
                <button
                  type="button"
                  onClick={acceptAiSuggestion}
                  className="flex-1 bg-primary-500 text-[#0a0a0f] px-4 py-3 rounded-xl hover:bg-primary-400 transition-all font-black text-sm"
                >
                  {language === 'en' ? 'Accept Suggestion' : 'Accetta Suggerimento'}
                </button>
                <button
                  type="button"
                  onClick={() => setAiSuggestion(null)}
                  className="flex-1 bg-gray-700/50 text-gray-300 px-4 py-3 rounded-xl hover:bg-gray-700 transition-all font-black text-sm border border-gray-600/50"
                >
                  {language === 'en' ? 'Dismiss' : 'Rifiuta'}
                </button>
              </div>
            </div>
          )}

          {/* Name */}
          <div className="mb-6">
            <label className="block text-sm font-black text-gray-300 mb-3 uppercase tracking-wider">
              {language === 'en' ? 'Item Name' : 'Nome Articolo'} *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-5 py-4 bg-[#0a0a0f] border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500/50 transition-all"
              placeholder={language === 'en' ? 'Enter item name' : 'Inserisci nome articolo'}
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-black text-gray-300 mb-3 uppercase tracking-wider">
              {language === 'en' ? 'Description' : 'Descrizione'} *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={4}
              className="w-full px-5 py-4 bg-[#0a0a0f] border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500/50 transition-all resize-none"
              placeholder={language === 'en' ? 'Describe your item...' : 'Descrivi il tuo articolo...'}
            />
          </div>

          {/* Category and Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-black text-gray-300 mb-3 uppercase tracking-wider">
                {language === 'en' ? 'Category' : 'Categoria'} *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                className="w-full px-5 py-4 bg-[#0a0a0f] border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500/50 transition-all"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#0a0a0f]">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-black text-gray-300 mb-3 uppercase tracking-wider">
                {language === 'en' ? 'Price per Day (€)' : 'Prezzo per Giorno (€)'} *
              </label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={formData.pricePerDay}
                onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })}
                required
                className="w-full px-5 py-4 bg-[#0a0a0f] border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500/50 transition-all"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Link
              href="/rentals"
              className="flex-1 py-5 px-4 glass border border-white/10 text-white rounded-2xl font-black text-lg hover:bg-white/10 transition-all text-center"
            >
              {language === 'en' ? 'Cancel' : 'Annulla'}
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-5 px-4 bg-primary-500 text-[#0a0a0f] rounded-2xl font-black text-lg hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all glow-green hover:glow-green-strong transform hover:scale-[1.02] relative overflow-hidden group"
            >
              <span className="relative z-10">
                {loading 
                  ? (language === 'en' ? 'Publishing...' : 'Pubblicazione...')
                  : (language === 'en' ? 'Publish Item' : 'Pubblica Articolo')
                }
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

