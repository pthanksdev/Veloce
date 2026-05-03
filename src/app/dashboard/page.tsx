"use client";

import { useState, useEffect } from "react";
import { Plus, Play, Clock, MoreVertical, TrendingUp, Loader2 } from "lucide-react";
import UploadModal from "@/components/video/UploadModal";
import Link from "next/link";
import axios from "axios";
import { Video } from "@/types";
import { useCallback } from "react";

export default function DashboardPage() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVideos = useCallback(async () => {
    try {
      const response = await axios.get("/api/videos");
      setVideos(response.data);
    } catch (error) {
      console.error("Failed to fetch videos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  return (
    <div className="space-y-10">
      {/* Featured Section */}
      <section className="relative min-h-[320px] lg:h-80 rounded-3xl overflow-hidden group cursor-pointer border border-zinc-800 shadow-2xl flex flex-col justify-end p-6 lg:p-0">
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=80" 
          alt="Featured" 
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="relative z-20 max-w-lg lg:ml-8 lg:mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-indigo-600 text-[10px] font-bold uppercase tracking-widest rounded-full">Featured</span>
            <span className="text-zinc-400 text-xs flex items-center gap-1"><Clock size={12} /> 12 mins ago</span>
          </div>
          <h2 className="text-2xl lg:text-4xl font-black text-white mb-4 tracking-tight">The Art of Abstract Motion</h2>
          <p className="text-zinc-300 text-sm mb-6 line-clamp-2 leading-relaxed">
            Explore the mesmerizing world of fluid simulations and abstract geometry in this stunning visual showcase.
          </p>
          <button className="flex items-center gap-2 px-6 py-3 bg-white text-zinc-950 font-bold rounded-2xl hover:bg-zinc-200 transition-all w-fit">
            <Play size={18} fill="currentColor" /> Watch Now
          </button>
        </div>
      </section>

      {/* Grid Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TrendingUp size={24} className="text-indigo-400" />
          <h3 className="text-2xl font-bold text-white tracking-tight">Recommended for you</h3>
        </div>
        <button 
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 font-bold rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-lg shadow-indigo-500/5"
        >
          <Plus size={18} /> Upload Video
        </button>
      </div>

      {/* Video Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={40} className="animate-spin text-indigo-500" />
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-zinc-900 border-dashed">
          <p className="text-zinc-500 mb-4">No videos found. Be the first to upload!</p>
          <button 
            onClick={() => setIsUploadOpen(true)}
            className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-500 transition-all"
          >
            Upload Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}

      <UploadModal 
        isOpen={isUploadOpen} 
        onClose={() => {
          setIsUploadOpen(false);
          fetchVideos();
        }} 
      />
    </div>
  );
}

function VideoCard({ video }: { video: Video }) {
  return (
    <Link href={`/watch/${video.id}`} className="group cursor-pointer block">
      <div className="relative aspect-video rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 mb-3 group-hover:border-indigo-500/50 transition-all shadow-xl">
        <img 
          src={`/${video.thumbnailUrl}`} 
          alt={video.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-zinc-950/80 backdrop-blur-md rounded text-[10px] font-bold text-white">
          {video.duration ? `${Math.floor(video.duration / 60)}:${Math.floor(video.duration % 60).toString().padStart(2, '0')}` : "HD"}
        </div>
        <div className="absolute inset-0 bg-zinc-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 transform scale-90 group-hover:scale-100 transition-transform">
            <Play size={24} className="text-white fill-white ml-1" />
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <div className="w-9 h-9 rounded-xl bg-zinc-800 flex-shrink-0 overflow-hidden border border-zinc-700">
           <img src={video.user?.image || `https://i.pravatar.cc/150?u=${video.userId}`} alt="Avatar" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-white mb-1 line-clamp-2 leading-snug group-hover:text-indigo-400 transition-colors">
            {video.title}
          </h4>
          <p className="text-xs text-zinc-500 font-medium">{video.user?.name || "Creator"}</p>
          <div className="flex items-center gap-2 mt-1 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
            <span>{video.views} Views</span>
            <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
            <span>{new Date(video.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <button className="text-zinc-600 hover:text-white p-1 rounded-lg transition-colors h-fit">
          <MoreVertical size={16} />
        </button>
      </div>
    </Link>
  );
}
