"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Video, List, Edit3, Settings, Play, MoreVertical } from "lucide-react";
import Link from "next/link";
import axios from "axios";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [userVideos, setUserVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"videos" | "playlists">("videos");

  useEffect(() => {
    const fetchUserVideos = async () => {
      if (!session?.user) return;
      try {
        const response = await axios.get("/api/videos/user");
        setUserVideos(response.data);
      } catch (error) {
        console.error("Failed to fetch user videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserVideos();
  }, [session]);

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Profile Header */}
      <div className="relative h-60 rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
        <div className="absolute bottom-8 left-8 flex items-end gap-6">
          <div className="w-32 h-32 rounded-3xl bg-zinc-800 border-4 border-zinc-950 overflow-hidden shadow-2xl">
            {session?.user?.image ? (
              <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-500">No Image</div>
            )}
          </div>
          <div className="mb-2">
            <h1 className="text-4xl font-black text-white tracking-tight">{session?.user?.name || "Creative Creator"}</h1>
            <p className="text-zinc-500 font-medium">@{session?.user?.email?.split('@')[0] || "creator"}</p>
          </div>
        </div>
        <div className="absolute bottom-8 right-8 flex gap-3">
          <Link href="/settings" className="flex items-center gap-2 px-6 py-3 bg-zinc-800 text-white font-bold rounded-2xl hover:bg-zinc-700 transition-all border border-zinc-700">
            <Settings size={18} /> Edit Profile
          </Link>
          <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20">
            <Edit3 size={18} /> Customize Channel
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Subscribers" value="1.2M" />
        <StatCard label="Total Views" value="45.8M" />
        <StatCard label="Videos" value={userVideos.length.toString()} />
        <StatCard label="Playlists" value="12" />
      </div>

      {/* Content Tabs */}
      <div className="space-y-6">
        <div className="flex items-center gap-8 border-b border-zinc-900 pb-1">
          <TabButton 
            active={activeTab === "videos"} 
            onClick={() => setActiveTab("videos")}
            icon={<Video size={18} />}
            label="Videos"
          />
          <TabButton 
            active={activeTab === "playlists"} 
            onClick={() => setActiveTab("playlists")}
            icon={<List size={18} />}
            label="Playlists"
          />
        </div>

        {activeTab === "videos" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-full py-20 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500"></div>
              </div>
            ) : userVideos.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-zinc-900/30 rounded-3xl border border-zinc-800 border-dashed">
                <p className="text-zinc-500">You haven&apos;t uploaded any videos yet.</p>
              </div>
            ) : (
              userVideos.map((video) => (
                <VideoItem key={video.id} video={video} />
              ))
            )}
          </div>
        )}

        {activeTab === "playlists" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="aspect-video rounded-3xl border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-900 transition-all group">
              <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <List size={24} className="text-zinc-500 group-hover:text-indigo-400" />
              </div>
              <p className="text-sm font-bold text-zinc-500">Create New Playlist</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string, value: string }) {
  return (
    <div className="p-6 bg-zinc-900/50 rounded-3xl border border-zinc-900 hover:border-zinc-800 transition-all">
      <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-2 py-4 border-b-2 transition-all relative ${
        active ? "border-indigo-500 text-white" : "border-transparent text-zinc-500 hover:text-white"
      }`}
    >
      {icon}
      <span className="font-bold">{label}</span>
    </button>
  );
}

function VideoItem({ video }: { video: any }) {
  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-video rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 mb-3 group-hover:border-indigo-500/50 transition-all shadow-xl">
        <img 
          src={`/${video.thumbnailUrl}`} 
          alt={video.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-zinc-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
           <Play size={24} className="text-white fill-white ml-1" />
        </div>
      </div>
      <div className="flex gap-2 justify-between">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-white mb-1 line-clamp-2 leading-snug group-hover:text-indigo-400 transition-colors">
            {video.title}
          </h4>
          <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            <span>{video.views} Views</span>
            <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
            <span>{new Date(video.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <button className="text-zinc-600 hover:text-white p-1 h-fit">
          <MoreVertical size={16} />
        </button>
      </div>
    </div>
  );
}
