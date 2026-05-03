"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Play, Upload, Shield, Zap, Layers, ChevronRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/Badge";

export default function LandingPage() {
  const { data: session, status } = useSession();

  if (status === "authenticated") {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* 3D Background System */}
      <div className="mesh-gradient">
        <div className="mesh-orb mesh-orb-1" />
        <div className="mesh-orb mesh-orb-2" />
        <div className="mesh-orb mesh-orb-3" />
      </div>

      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 backdrop-blur-md bg-zinc-950/50 sticky top-0 z-50 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Play className="text-white fill-white" size={20} />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white italic uppercase">Veloce</span>
        </div>
        
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                Dashboard
              </Link>
              <button 
                onClick={() => signOut()}
                className="px-4 py-2 text-sm font-medium bg-zinc-800 hover:bg-zinc-700 rounded-full transition-all"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button 
              onClick={() => signIn("google")}
              className="px-6 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 rounded-full transition-all shadow-lg shadow-indigo-500/20"
            >
              Sign In with Google
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center overflow-hidden">
        {/* Animated background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/20 blur-[120px] -z-10 rounded-full" />
        
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tight mb-6 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent px-4 text-glow animate-in fade-in slide-in-from-top-10 duration-1000">
          Stream Beyond <br /> Limits.
        </h1>
        <p className="text-base md:text-xl text-zinc-400 max-w-2xl mb-10 px-4 animate-in fade-in duration-1000 delay-300">
          Experience ultra-smooth adaptive bitrate streaming, instant thumbnails, and professional-grade video hosting for everyone.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => session ? window.location.href = "/dashboard" : signIn("google")}
            className="px-8 py-4 bg-white text-zinc-950 font-bold rounded-full hover:bg-zinc-200 transition-all flex items-center gap-2 group"
          >
            Get Started <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-8 py-4 bg-zinc-900 text-white font-bold rounded-full border border-zinc-800 hover:bg-zinc-800 transition-all">
            View Demo
          </button>
        </div>

        {/* Mockup Preview */}
        <div className="mt-20 w-full max-w-4xl animate-in zoom-in duration-1000 delay-500 perspective-1000">
          <img 
            src="/assets/undraw_video-streaming_cckz.svg" 
            alt="Streaming Preview" 
            className="w-full h-auto drop-shadow-[0_0_80px_rgba(79,70,229,0.3)] hover:rotate-x-2 hover:rotate-y-2 transition-transform duration-700"
          />
        </div>
      </section>

      {/* How it Works Section */}
      <section className="px-6 py-24 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Built for the Modern Web</h2>
          <p className="text-zinc-400 text-lg">We handle the complex video engineering so you can focus on creating great content.</p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-zinc-800 to-transparent -z-10" />
          
          <StepCard 
            number="01"
            title="Upload"
            description="Drag and drop your high-res videos. We support all major formats up to 4K."
            image="/assets/undraw_uploading_nu4x.svg"
          />
          <StepCard 
            number="02"
            title="Transcode"
            description="Our FFmpeg engine automatically generates HLS segments for adaptive streaming."
            image="/assets/undraw_video-files_cxl9.svg"
          />
          <StepCard 
            number="03"
            title="Stream"
            description="Your video is served globally with zero-buffering, adjusting to any network speed."
            image="/assets/undraw_video-streaming_cckz.svg"
          />
        </div>
      </section>

      {/* Creator Tools Section */}
      <section className="px-6 py-24 bg-gradient-to-b from-zinc-950 to-zinc-900 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <Badge variant="secondary" className="px-4 py-1.5 text-xs">For Creators</Badge>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">Everything you need to <span className="text-indigo-500">own your channel.</span></h2>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle2 size={14} className="text-white" />
                </div>
                <div>
                  <h4 className="text-white font-bold">Custom Playlists</h4>
                  <p className="text-zinc-400 text-sm">Organize your content into premium collections for your audience.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle2 size={14} className="text-white" />
                </div>
                <div>
                  <h4 className="text-white font-bold">In-Depth Analytics</h4>
                  <p className="text-zinc-400 text-sm">Track views, engagement, and audience retention in real-time.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle2 size={14} className="text-white" />
                </div>
                <div>
                  <h4 className="text-white font-bold">Community Interaction</h4>
                  <p className="text-zinc-400 text-sm">Engage with your fans through our integrated nested comment system.</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="flex-1 relative">
             <div className="absolute inset-0 bg-indigo-600/10 blur-[100px] -z-10 rounded-full" />
             <img 
               src="/assets/undraw_social-bio_2xzi.svg" 
               className="w-full h-auto drop-shadow-2xl" 
               alt="Creator Dashboard" 
             />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-32 text-center bg-zinc-950 relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/10 blur-[120px] -z-10 rounded-full" />
        <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight">Ready to start <br /> streaming?</h2>
        <button 
          onClick={() => signIn("google")}
          className="px-10 py-5 bg-white text-zinc-950 text-lg font-black rounded-full hover:bg-zinc-200 transition-all shadow-2xl shadow-white/5"
        >
          Join Veloce Today
        </button>
      </section>
      
      {/* Footer */}
      <footer className="mt-auto py-12 px-6 border-t border-zinc-900 bg-zinc-950 text-center">
        <p className="text-zinc-500 text-sm">© 2026 Veloce. All rights reserved.</p>
      </footer>
    </div>
  );
}

function StepCard({ number, title, description, image }: { number: string, title: string, description: string, image: string }) {
  return (
    <div className="flex flex-col items-center text-center space-y-6">
      <div className="w-full max-w-[200px] aspect-square flex items-center justify-center p-4">
        <img src={image} alt={title} className="w-full h-full object-contain" />
      </div>
      <div className="space-y-4">
        <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-indigo-500 font-black text-lg mx-auto shadow-xl">
          {number}
        </div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-[2.5rem] glass-3d hover:-translate-y-2 group transition-all duration-500">
      <div className="w-14 h-14 rounded-2xl bg-zinc-950 flex items-center justify-center mb-6 shadow-2xl group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-white group-hover:text-indigo-400 transition-colors">{title}</h3>
      <p className="text-zinc-400 leading-relaxed text-sm">{description}</p>
    </div>
  );
}
