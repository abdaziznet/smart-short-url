import React from 'react';
import { X, Globe, Clock, CheckCircle, ShieldCheck } from 'lucide-react';
import { ShortLink } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface StatsModalProps {
  link: ShortLink;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ link, onClose }) => {
  // Mock data for the chart since we don't have a real backend history
  const data = [
    { name: 'Mon', visits: Math.floor(link.visits * 0.1) },
    { name: 'Tue', visits: Math.floor(link.visits * 0.2) },
    { name: 'Wed', visits: Math.floor(link.visits * 0.15) },
    { name: 'Thu', visits: Math.floor(link.visits * 0.3) },
    { name: 'Fri', visits: Math.floor(link.visits * 0.25) },
    { name: 'Sat', visits: 0 },
    { name: 'Sun', visits: 0 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-up">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Analytics</h3>
            <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
              <Globe className="w-3 h-3" />
              {link.shortCode}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">Total Visits</p>
              <p className="text-3xl font-bold text-slate-800">{link.visits}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
              <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-1">Created</p>
              <p className="text-lg font-bold text-slate-800 flex items-center gap-1">
                 <Clock className="w-4 h-4" />
                 {new Date(link.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
              <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">Status</p>
              <p className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Active
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm mb-6">
             <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-slate-700">Weekly Engagement</h4>
                <div className="text-xs px-2 py-1 bg-slate-100 rounded-md text-slate-500">Last 7 days</div>
             </div>
             <div className="h-48 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={data}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                    <Tooltip 
                      cursor={{fill: '#f1f5f9'}}
                      contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                    />
                    <Bar dataKey="visits" radius={[4, 4, 0, 0]}>
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="#3b82f6" />
                      ))}
                    </Bar>
                 </BarChart>
               </ResponsiveContainer>
             </div>
          </div>
          
          {link.title && (
             <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <h4 className="text-sm font-semibold text-slate-800 mb-2">Original Metadata</h4>
                <div className="text-sm text-slate-600">
                   <p className="truncate"><span className="font-medium text-slate-900">Title:</span> {link.title}</p>
                   <p className="truncate mt-1"><span className="font-medium text-slate-900">URL:</span> {link.originalUrl}</p>
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
