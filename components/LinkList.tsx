import React from 'react';
import { ShortLink } from '../types';
import { ExternalLink, Copy, Trash2, BarChart2, Calendar, Tag } from 'lucide-react';

interface LinkListProps {
  links: ShortLink[];
  onDelete: (id: string) => void;
  onCopy: (code: string) => void;
  onViewStats: (link: ShortLink) => void;
}

export const LinkList: React.FC<LinkListProps> = ({ links, onDelete, onCopy, onViewStats }) => {
  if (links.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-100">
        <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <ExternalLink className="w-8 h-8 text-blue-500" />
        </div>
        <h3 className="text-lg font-medium text-slate-800">No links created yet</h3>
        <p className="text-slate-500 mt-2">Create your first shortened link above!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {links.map((link) => (
        <div key={link.id} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            {/* Left Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg text-slate-800 truncate" title={link.title || link.originalUrl}>
                  {link.title || 'Untitled Link'}
                </h3>
                {link.tags && link.tags.map(tag => (
                  <span key={tag} className="hidden sm:inline-block px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full font-medium border border-blue-100">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center text-sm text-slate-500 mb-3 truncate">
                <ExternalLink className="w-3 h-3 mr-1 flex-shrink-0" />
                <a href={link.originalUrl} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 truncate transition-colors">
                  {link.originalUrl}
                </a>
              </div>

              {link.summary && (
                <p className="text-sm text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 mb-3 line-clamp-2">
                  <span className="font-medium text-purple-600 text-xs uppercase tracking-wide mr-1">AI Summary</span>
                  {link.summary}
                </p>
              )}

              <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                <span className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(link.createdAt).toLocaleDateString()}
                </span>
                <span className={`flex items-center ${link.visits > 0 ? 'text-green-600' : ''}`}>
                  <BarChart2 className="w-3 h-3 mr-1" />
                  {link.visits} visits
                </span>
              </div>
            </div>

            {/* Right Actions - Sticky on mobile via CSS usually, but flex handles it here */}
            <div className="flex flex-row md:flex-col justify-between md:justify-start items-end gap-3 md:pl-6 md:border-l border-slate-100">
              <div className="flex flex-col items-end w-full">
                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Short Link</div>
                <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg font-mono text-sm border border-blue-100">
                  <span className="select-all">app/#/r/{link.shortCode}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2">
                 <button
                  onClick={() => onViewStats(link)}
                  className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  title="View Analytics"
                >
                  <BarChart2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onCopy(link.shortCode)}
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Copy Link"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(link.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
