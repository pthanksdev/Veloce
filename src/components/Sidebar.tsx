"use client";

import { Home, Compass, Library, History, Settings, User, LogOut, Upload, X } from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

const SidebarItem = ({ icon: Icon, label, href, active, onClick }: { icon: React.ElementType, label: string, href: string, active?: boolean, onClick?: () => void }) => (
  <Link 
    href={href}
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group ${
      active ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
    }`}
  >
    <Icon size={20} className={`${active ? "text-white" : "text-zinc-500 group-hover:text-indigo-400"} transition-colors`} />
    <span className="font-medium">{label}</span>
  </Link>
);

interface SidebarProps {
  onMobileClose?: () => void;
}

export default function Sidebar({ onMobileClose }: SidebarProps) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const handleLinkClick = () => {
    if (onMobileClose) onMobileClose();
  };

  return (
    <aside className="w-full lg:w-64 border-r border-zinc-900 h-screen flex flex-col p-4 bg-zinc-950 relative">
      <div className="flex items-center justify-between px-4 mb-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Upload className="text-white fill-white" size={16} />
          </div>
          <span className="text-xl font-black tracking-tighter text-white italic uppercase">Veloce</span>
        </div>
        <button 
          onClick={onMobileClose}
          className="lg:hidden p-2 text-zinc-500 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 space-y-2">
        <SidebarItem icon={Home} label="Home" href="/dashboard" active={pathname === "/dashboard"} onClick={handleLinkClick} />
        <SidebarItem icon={Compass} label="Explore" href="/explore" active={pathname === "/explore"} onClick={handleLinkClick} />
        <SidebarItem icon={Library} label="Playlists" href="/playlists" active={pathname === "/playlists"} onClick={handleLinkClick} />
        <SidebarItem icon={History} label="History" href="/history" active={pathname === "/history"} onClick={handleLinkClick} />
      </nav>

      <div className="pt-10 border-t border-zinc-900 space-y-2">
        <SidebarItem icon={User} label="Profile" href="/profile" active={pathname === "/profile"} onClick={handleLinkClick} />
        <SidebarItem icon={Settings} label="Settings" href="/settings" active={pathname === "/settings"} onClick={handleLinkClick} />
        <button 
          onClick={() => signOut()}
          className="flex items-center gap-3 px-4 py-3 w-full text-zinc-400 hover:bg-red-500/10 hover:text-red-400 rounded-2xl transition-all group"
        >
          <LogOut size={20} className="text-zinc-500 group-hover:text-red-400" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
