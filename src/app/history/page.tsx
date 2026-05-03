"use client";

import { History, Trash2, Clock, Play, MoreVertical } from "lucide-react";
import { useState } from "react";

export default function HistoryPage() {
  const [historyItems, setHistoryItems] = useState([1, 2, 3, 4, 5]);

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <History size={32} className="text-indigo-400" />
          <h1 className="text-4xl font-black text-white tracking-tight">Watch History</h1>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-red-500/10 text-red-500 border border-red-500/20 font-bold rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/5">
          <Trash2 size={18} /> Clear All History
        </button>
      </div>

      <div className="space-y-6">
        {historyItems.length > 0 ? (
          historyItems.map((item) => (
            <HistoryItem key={item} />
          ))
        ) : (
          <div className="py-20 text-center bg-zinc-900/30 rounded-3xl border border-zinc-800 border-dashed">
            <p className="text-zinc-500">Your watch history is empty.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function HistoryItem() {
  return (
    <div className="flex flex-col sm:flex-row gap-6 p-4 rounded-3xl hover:bg-zinc-900/50 transition-all border border-transparent hover:border-zinc-800 group">
      <div className="relative w-full sm:w-64 aspect-video rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 flex-shrink-0 group-hover:border-indigo-500/50 transition-all">
        <img src={`https://picsum.photos/seed/${Math.random()}/640/360`} alt="Thumb" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-zinc-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
            <Play size={20} className="text-white fill-white ml-0.5" />
          </div>
        </div>
        {/* Watch Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800">
          <div className="h-full bg-indigo-500" style={{ width: "65%" }} />
        </div>
      </div>

      <div className="flex-1 flex flex-col py-1">
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-xl font-bold text-white line-clamp-2 leading-snug group-hover:text-indigo-400 transition-colors">
            Mastering Motion Graphics in 2026: A Full Course
          </h3>
          <button className="text-zinc-500 hover:text-white transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
        <p className="text-zinc-400 text-sm font-medium mt-1">Design Masterclass</p>
        <p className="text-zinc-500 text-xs mt-3 flex items-center gap-2 font-bold uppercase tracking-widest">
          <Clock size={12} /> Watched on May 2nd, 2026
        </p>
        <p className="text-sm text-zinc-500 mt-4 line-clamp-2 leading-relaxed">
          Learn everything you need to know about modern motion graphics, from basic principles to advanced node-based compositions.
        </p>
      </div>
    </div>
  );
}
