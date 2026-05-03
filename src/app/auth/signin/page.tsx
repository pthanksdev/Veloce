"use client";

import { signIn } from "next-auth/react";
import { Play } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SignInContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-zinc-950">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full -z-10" />

      <div className="w-full max-w-md p-8">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/20">
              <Play className="text-white fill-white" size={24} />
            </div>
            <span className="text-3xl font-black tracking-tighter text-white italic uppercase">Veloce</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-black text-white tracking-tight">Welcome Back</h1>
            <p className="text-zinc-500 font-medium">Sign in to manage your channel and start streaming.</p>
          </div>

          {error && (
            <div className="w-full p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
              <p className="text-sm text-red-400 font-medium text-center">
                {error === "Callback" 
                  ? "OAuth Configuration Error. Please check your Redirect URIs in Google Console."
                  : "An error occurred during sign in. Please try again."}
              </p>
            </div>
          )}

          <div className="w-full pt-4">
            <button 
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full flex items-center justify-center gap-4 px-8 py-4 bg-white text-zinc-950 font-black rounded-2xl hover:bg-zinc-200 transition-all shadow-2xl shadow-white/10 group"
            >
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
              Continue with Google
            </button>
          </div>

          <p className="text-xs text-zinc-600 font-bold uppercase tracking-widest pt-10">
            By continuing, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}
