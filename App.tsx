import React, { useState, useEffect } from 'react';
import { CreateLinkForm } from './components/CreateLinkForm';
import { LinkList } from './components/LinkList';
import { StatsModal } from './components/StatsModal';
import { RedirectPage } from './components/RedirectPage';
import { getLinks, saveLink, deleteLink } from './services/storageService';
import { ShortLink } from './types';
import { Zap, Github, Layers } from 'lucide-react';

const App: React.FC = () => {
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [selectedLink, setSelectedLink] = useState<ShortLink | null>(null);
  
  // Custom Hash Router Implementation
  const [route, setRoute] = useState<string>(window.location.hash);

  useEffect(() => {
    // Load initial data
    setLinks(getLinks());

    // Handle hash change for routing
    const handleHashChange = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleCreateLink = (newLink: ShortLink) => {
    saveLink(newLink);
    setLinks(getLinks()); // Refresh list
  };

  const handleDeleteLink = (id: string) => {
    deleteLink(id);
    setLinks(getLinks());
  };

  const handleCopyLink = (code: string) => {
    const url = `${window.location.origin}${window.location.pathname}#/r/${code}`;
    navigator.clipboard.writeText(url);
    // Could add toast here
    alert(`Copied: ${url}`);
  };

  // Check if current route is a redirect route (e.g. #/r/xyz)
  const redirectMatch = route.match(/^#\/r\/(.+)$/);

  if (redirectMatch) {
    const shortCode = redirectMatch[1];
    return <RedirectPage shortCode={shortCode} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-blue-600 to-purple-600 p-2 rounded-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-800 tracking-tight">SmartShort</span>
          </div>
          <div className="flex items-center gap-4">
             <a href="#" className="text-slate-500 hover:text-slate-800 transition-colors">
               <Github className="w-5 h-5" />
             </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-[#F8FAFC]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Shorten URLs with <span className="text-blue-600">AI Superpowers</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-xl mx-auto">
              Transform long, ugly links into smart, trackable short URLs. 
              Let our AI analyze content and suggest the perfect alias.
            </p>
          </div>

          <CreateLinkForm onSave={handleCreateLink} />

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Layers className="w-5 h-5 text-slate-400" />
              Your Links
            </h2>
            <span className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
              {links.length} Active
            </span>
          </div>

          <LinkList 
            links={links} 
            onDelete={handleDeleteLink} 
            onCopy={handleCopyLink}
            onViewStats={setSelectedLink}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-5xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} SmartShort. Built with React & Gemini.</p>
        </div>
      </footer>

      {/* Modal */}
      {selectedLink && (
        <StatsModal 
          link={selectedLink} 
          onClose={() => setSelectedLink(null)} 
        />
      )}
    </div>
  );
};

export default App;
