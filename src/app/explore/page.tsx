"use client";

import { TrendingUp, Music, Trophy, Gamepad2, Film, Newspaper, Search, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function ExplorePage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [activeCategory, setActiveCategory] = useState(query ? "Search Results" : "Trending");
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { name: "Trending", icon: <TrendingUp size={20} /> },
    { name: "Music", icon: <Music size={20} /> },
    { name: "Gaming", icon: <Gamepad2 size={20} /> },
    { name: "Sports", icon: <Trophy size={20} /> },
    { name: "Movies", icon: <Film size={20} /> },
    { name: "News", icon: <Newspaper size={20} /> },
  ];

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const url = query 
          ? `/api/videos/search?q=${encodeURIComponent(query)}`
          : `/api/videos?status=COMPLETED`;
        const response = await axios.get(url);
        setVideos(response.data);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
    if (query) setActiveCategory("Search Results");
  }, [query]);

  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-black text-white tracking-tight">
        {query ? `Search: ${query}` : "Explore"}
      </h1>

      {/* Category Grid */}
      {!query && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <button 
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex flex-col items-center justify-center p-6 rounded-3xl border transition-all ${
                activeCategory === cat.name 
                  ? "bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-500/20 text-white scale-105" 
                  : "bg-zinc-900/50 border-zinc-900 text-zinc-500 hover:border-zinc-800 hover:text-white"
              }`}
            >
              <div className="mb-3">{cat.icon}</div>
              <span className="text-sm font-bold tracking-tight">{cat.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Content Section */}
      <div className="space-y-8 pt-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-indigo-500 rounded-full" />
          <h2 className="text-2xl font-bold text-white">{activeCategory}</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={40} className="animate-spin text-indigo-500" />
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-zinc-900 border-dashed">
            <Search size={40} className="mx-auto text-zinc-700 mb-4" />
            <p className="text-zinc-500">No videos found for "{query || activeCategory}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos.map((video) => (
              <ExploreVideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ExploreVideoCard({ video }: { video: any }) {
  return (
    <Link href={`/watch/${video.id}`} className="group cursor-pointer block">
      <div className="relative aspect-video rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 mb-3 group-hover:border-indigo-500/50 transition-all shadow-xl">
        <img 
          src={`/${video.thumbnailUrl}`} 
          alt={video.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-zinc-950/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <h4 className="text-sm font-bold text-white mb-1 line-clamp-2 leading-snug group-hover:text-indigo-400 transition-colors">
        {video.title}
      </h4>
      <p className="text-xs text-zinc-500 font-medium">{video.user?.name || "Creator"}</p>
      <div className="flex items-center gap-2 mt-1 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
        <span>{video.views} Views</span>
        <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
        <span>{new Date(video.createdAt).toLocaleDateString()}</span>
      </div>
    </Link>
  );
}
