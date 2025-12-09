import React, { useState } from 'react';
import { Wand2, Link2, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { analyzeUrlWithGemini } from '../services/geminiService';
import { isValidUrl, generateId } from '../services/storageService';
import { ShortLink, AIAnalysisResult } from '../types';

interface CreateLinkFormProps {
  onSave: (link: ShortLink) => void;
}

export const CreateLinkForm: React.FC<CreateLinkFormProps> = ({ onSave }) => {
  const [url, setUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!url || !isValidUrl(url)) {
      setError("Please enter a valid URL (e.g., https://example.com)");
      return;
    }
    
    setError(null);
    setIsAnalyzing(true);
    
    try {
      const result = await analyzeUrlWithGemini(url);
      setAiResult(result);
      if (result.suggestedAlias && !alias) {
        setAlias(result.suggestedAlias);
      }
    } catch (err) {
      setError("Failed to analyze URL with AI. Try manual entry.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    if (!isValidUrl(url)) {
      setError("Invalid URL format");
      return;
    }

    const shortCode = alias.trim() || generateId();
    
    const newLink: ShortLink = {
      id: generateId(),
      originalUrl: url,
      shortCode,
      createdAt: Date.now(),
      visits: 0,
      title: aiResult?.title,
      summary: aiResult?.summary,
      tags: aiResult?.tags,
    };

    onSave(newLink);
    
    // Reset form
    setUrl('');
    setAlias('');
    setAiResult(null);
    setError(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 mb-8 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-50 blur-3xl pointer-events-none"></div>

      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">Shorten a new link</span>
      </h2>

      <form onSubmit={handleSubmit} className="relative z-10">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Destination URL</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Link2 className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="url"
                required
                className="block w-full pl-10 pr-24 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400"
                placeholder="https://very-long-url.com/awesome-content"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isAnalyzing || !url}
                className="absolute right-2 top-2 bottom-2 px-3 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                <span className="hidden sm:inline">{isAnalyzing ? 'Thinking...' : 'AI Magic'}</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100 animate-fade-in">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {aiResult && (
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-4 border border-blue-100 animate-fade-in">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Wand2 className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">{aiResult.title}</h4>
                  <p className="text-xs text-slate-600 mt-1">{aiResult.summary}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {aiResult.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-white text-slate-600 text-[10px] uppercase font-bold tracking-wider rounded border border-slate-200 shadow-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Custom Alias (Optional)</label>
              <div className="flex items-center">
                <span className="bg-slate-50 border border-r-0 border-slate-200 rounded-l-xl px-3 py-3 text-slate-500 text-sm font-mono">
                  app/#/r/
                </span>
                <input
                  type="text"
                  className="flex-1 block w-full border border-slate-200 rounded-r-xl py-3 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400 font-mono text-sm"
                  placeholder="custom-name"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                  maxLength={20}
                />
              </div>
            </div>
            
            <div className="sm:self-end">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md shadow-blue-200 transition-all transform active:scale-95 flex items-center justify-center gap-2"
              >
                Create Link <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
