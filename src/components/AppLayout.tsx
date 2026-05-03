"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Search, Bell, User, Menu, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  if (status === "unauthenticated") {
    redirect("/");
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-950">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <div className={cn(
        "fixed inset-y-0 left-0 w-72 z-[110] transition-transform duration-300 lg:hidden",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar onMobileClose={() => setIsSidebarOpen(false)} />
      </div>

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-20 border-b border-zinc-900 flex items-center justify-between px-4 lg:px-8 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-zinc-400 hover:bg-zinc-900 rounded-xl transition-all"
            >
              <Menu size={24} />
            </button>

            <div className="flex-1 max-w-xl hidden md:block">
              <form onSubmit={handleSearch} className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search videos, creators..." 
                  className="w-full bg-zinc-900/50 border border-zinc-800 py-3 pl-12 pr-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-white placeholder-zinc-500"
                />
              </form>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-6">
             <button className="md:hidden p-2.5 text-zinc-400 hover:bg-zinc-900 rounded-xl transition-all">
              <Search size={20} />
            </button>
            <button className="p-2.5 text-zinc-400 hover:bg-zinc-900 rounded-xl transition-all relative">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-zinc-950"></span>
            </button>
            <div className="flex items-center gap-3 pl-2 lg:pl-6 border-l border-zinc-800">
              <div className="text-right hidden xl:block">
                <p className="text-sm font-bold text-white leading-none">{session?.user?.name}</p>
                <p className="text-xs text-zinc-500 mt-1">{session?.user?.email}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 overflow-hidden flex items-center justify-center flex-shrink-0">
                {session?.user?.image ? (
                  <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <User size={20} className="text-zinc-500" />
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-4 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
