import React, { useEffect, useState } from 'react';
import { getLinkByCode, incrementVisits } from '../services/storageService';
import { Loader2, AlertTriangle, ArrowRight } from 'lucide-react';

interface RedirectPageProps {
  shortCode: string;
}

export const RedirectPage: React.FC<RedirectPageProps> = ({ shortCode }) => {
  const [error, setError] = useState<string | null>(null);
  const [destination, setDestination] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API latency for effect
    const timer = setTimeout(() => {
      const link = getLinkByCode(shortCode);

      if (link) {
        setDestination(link.originalUrl);
        incrementVisits(shortCode);
        // Actual redirect after a brief moment to show the branding
        setTimeout(() => {
          window.location.href = link.originalUrl;
        }, 1500);
      } else {
        setError("Link not found");
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [shortCode]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-slate-100">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Link Not Found</h1>
          <p className="text-slate-500 mb-6">The shortened link you are trying to access does not exist or has been removed.</p>
          <a href="/" className="inline-flex items-center justify-center px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-medium">
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-white"></div>
      
      <div className="relative z-10 text-center px-4 max-w-lg w-full">
        <div className="mb-8 relative">
           <div className="w-20 h-20 bg-blue-600 rounded-2xl rotate-3 absolute left-1/2 -translate-x-1/2 -top-1 opacity-20 animate-pulse"></div>
           <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white mx-auto relative shadow-xl shadow-blue-200">
              <ArrowRight className="w-10 h-10" />
           </div>
        </div>
        
        <h1 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Redirecting...</h1>
        
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-8 max-w-md mx-auto">
          <p className="text-slate-500 text-sm mb-1">Destination</p>
          <p className="text-slate-800 font-medium truncate">
            {destination || "Loading destination..."}
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Please wait while we send you on your way</span>
        </div>
      </div>

      <div className="absolute bottom-8 text-slate-400 text-xs">
        Powered by SmartShort
      </div>
    </div>
  );
};
