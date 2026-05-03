"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import HlsPlayer from "@/components/video/HlsPlayer";
import { ThumbsUp, ThumbsDown, Share2, MoreHorizontal, UserPlus } from "lucide-react";
import axios from "axios";

export default function WatchPage() {
  const { id } = useParams();
  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(`/api/videos/${id}`);
        setVideo(response.data);
      } catch (error) {
        console.error("Failed to fetch video:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white mb-2">Video not found</h2>
        <p className="text-zinc-500">The video you are looking for doesn&apos;t exist or is still processing.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        <HlsPlayer src={`/${video.hlsPath}`} poster={`/${video.thumbnailUrl}`} />
        
        <div className="space-y-4">
          <h1 className="text-2xl font-black text-white tracking-tight leading-tight">
            {video.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-zinc-900 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 overflow-hidden">
                <img src={video.user?.image || `https://i.pravatar.cc/150?u=${video.userId}`} alt="Author" />
              </div>
              <div>
                <p className="font-bold text-white">{video.user?.name || "Creator"}</p>
                <p className="text-xs text-zinc-500 font-medium">1.2M subscribers</p>
              </div>
              <button className="ml-4 px-6 py-2.5 bg-white text-zinc-950 font-bold rounded-full hover:bg-zinc-200 transition-all flex items-center gap-2">
                <UserPlus size={16} /> Subscribe
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-zinc-900 rounded-full border border-zinc-800 overflow-hidden">
                <button className="flex items-center gap-2 px-4 py-2.5 hover:bg-zinc-800 transition-all border-r border-zinc-800">
                  <ThumbsUp size={18} /> <span className="text-sm font-bold">12K</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 hover:bg-zinc-800 transition-all">
                  <ThumbsDown size={18} />
                </button>
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-full hover:bg-zinc-800 transition-all">
                <Share2 size={18} /> <span className="text-sm font-bold">Share</span>
              </button>
              <button className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-full hover:bg-zinc-800 transition-all">
                <MoreHorizontal size={18} />
              </button>
            </div>
          </div>

          <div className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-900">
            <div className="flex items-center gap-3 text-sm font-bold text-white mb-2">
              <span>{video.views} views</span>
              <span className="w-1 h-1 bg-zinc-700 rounded-full"></span>
              <span>{new Date(video.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">
              {video.description || "No description provided."}
            </p>
          </div>

          {/* Comments Section */}
          <div className="pt-8 space-y-8">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-black text-white tracking-tight">1.2K Comments</h3>
              <div className="flex items-center gap-2 text-sm font-bold text-zinc-500 uppercase tracking-widest ml-4">
                <span>Sort by</span>
                <button className="text-white hover:text-indigo-400 transition-colors">Top</button>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 overflow-hidden flex-shrink-0">
                <img src={`https://i.pravatar.cc/150?u=current`} alt="You" />
              </div>
              <div className="flex-1 space-y-3">
                <textarea 
                  placeholder="Add a comment..."
                  className="w-full bg-transparent border-b border-zinc-800 py-2 focus:outline-none focus:border-indigo-500 transition-all text-white resize-none"
                  rows={1}
                />
                <div className="flex justify-end gap-3">
                  <button className="px-4 py-2 text-sm font-bold text-zinc-500 hover:text-white transition-colors">Cancel</button>
                  <button className="px-6 py-2 text-sm font-bold bg-indigo-600 text-white rounded-full hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/10">Comment</button>
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-4">
              {[1, 2, 3].map((i) => (
                <CommentItem key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Suggestions */}
      <div className="w-full lg:w-[400px] space-y-4">
        <h3 className="text-lg font-bold text-white mb-4">Up Next</h3>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <SuggestionCard key={i} />
        ))}
      </div>
    </div>
  );
}

function CommentItem() {
  return (
    <div className="flex gap-4 group">
      <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 overflow-hidden flex-shrink-0">
        <img src={`https://i.pravatar.cc/150?u=user-comment`} alt="User" />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white">@AlexDesign</span>
          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">2 hours ago</span>
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed">
          This tutorial is absolutely incredible! The way you explained the FFmpeg integration was so clear. Definitely looking forward to more content like this.
        </p>
        <div className="flex items-center gap-4 pt-2">
          <div className="flex items-center gap-1.5 group/like cursor-pointer">
            <ThumbsUp size={14} className="text-zinc-600 group-hover/like:text-indigo-400" />
            <span className="text-xs font-bold text-zinc-600 group-hover/like:text-zinc-400">124</span>
          </div>
          <ThumbsDown size={14} className="text-zinc-600 cursor-pointer hover:text-red-400" />
          <button className="text-xs font-bold text-zinc-600 hover:text-white transition-colors uppercase tracking-widest">Reply</button>
        </div>
      </div>
    </div>
  );
}

function SuggestionCard() {
  return (
    <div className="flex gap-3 group cursor-pointer">
      <div className="relative w-40 aspect-video rounded-xl overflow-hidden flex-shrink-0 bg-zinc-900 border border-zinc-800 group-hover:border-indigo-500/50 transition-all">
        <img src={`https://picsum.photos/seed/suggest/320/180`} alt="Thumb" className="w-full h-full object-cover" />
        <div className="absolute bottom-1 right-1 px-1 py-0.5 bg-black/80 rounded text-[9px] font-bold text-white">
          10:05
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-white mb-1 line-clamp-2 leading-snug group-hover:text-indigo-400 transition-colors">
          Understanding the Physics of High-Speed Particles
        </h4>
        <p className="text-[11px] text-zinc-500 font-medium">Science Daily</p>
        <p className="text-[10px] text-zinc-400 mt-1 uppercase tracking-wider font-bold">450K views • 1 year ago</p>
      </div>
    </div>
  );
}
