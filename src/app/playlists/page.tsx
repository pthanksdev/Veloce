"use client";

import { List, Plus, Play, MoreVertical, Globe, Lock } from "lucide-react";
import { useState } from "react";

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState([1, 2, 3]);

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <List size={32} className="text-indigo-400" />
          <h1 className="text-4xl font-black text-white tracking-tight">Your Playlists</h1>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20">
          <Plus size={18} /> New Playlist
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {playlists.map((p) => (
          <PlaylistCard key={p} />
        ))}
      </div>
    </div>
  );
}

function PlaylistCard() {
  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-video rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 mb-4 group-hover:border-indigo-500/50 transition-all shadow-2xl">
        <img 
          src={`https://picsum.photos/seed/${Math.random()}/640/360`} 
          alt="Playlist Cover" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        
        {/* Playlist Overlay Effect */}
        <div className="absolute inset-y-0 right-0 w-1/3 bg-zinc-950/80 backdrop-blur-xl border-l border-white/10 flex flex-col items-center justify-center space-y-2">
          <List size={24} className="text-white" />
          <span className="text-xl font-black text-white">12</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Videos</span>
        </div>

        <div className="absolute inset-0 bg-zinc-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pr-1/3">
           <div className="w-12 h-12 bg-white text-zinc-950 rounded-full flex items-center justify-center shadow-xl">
             <Play size={20} fill="currentColor" className="ml-1" />
           </div>
        </div>
      </div>

      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
            Motion Graphics & VFX
          </h3>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-bold uppercase tracking-widest">
               <Globe size={12} /> Public
             </div>
             <div className="flex items-center gap-1.5 text-xs text-zinc-600 font-bold uppercase tracking-widest">
               Updated 2 days ago
             </div>
          </div>
        </div>
        <button className="text-zinc-600 hover:text-white p-1 rounded-lg transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>
    </div>
  );
}
