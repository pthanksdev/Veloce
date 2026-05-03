"use client";

import { useSession } from "next-auth/react";
import { User, Bell, Shield, Globe, Moon, Save, Camera, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { CldUploadWidget } from "next-cloudinary";
import axios from "axios";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState(session?.user?.name || "");
  const [image, setImage] = useState(session?.user?.image || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axios.post("/api/user/update", { name, image });
      await update(); // Update local session
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <h1 className="text-4xl font-black text-white tracking-tight">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigation */}
        <div className="space-y-2">
          <SettingsNavItem icon={User} label="Profile" active />
          <SettingsNavItem icon={Bell} label="Notifications" />
          <SettingsNavItem icon={Shield} label="Security" />
          <SettingsNavItem icon={Globe} label="Region" />
          <SettingsNavItem icon={Moon} label="Appearance" />
        </div>

        {/* Content */}
        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Public Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6 pb-6 border-b border-zinc-800">
                <div className="relative group cursor-pointer">
                  <div className="w-24 h-24 rounded-3xl bg-zinc-800 border border-zinc-700 overflow-hidden shadow-xl">
                    {image ? (
                      <img src={image} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                       <div className="w-full h-full flex items-center justify-center text-zinc-500 font-bold text-2xl">
                         {session?.user?.name?.[0] || "?"}
                       </div>
                    )}
                  </div>
                  <CldUploadWidget 
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                    onSuccess={(result) => {
                      if (result.info && typeof result.info !== 'string') {
                        setImage(result.info.secure_url);
                      }
                    }}
                  >
                    {({ open }) => (
                      <div 
                        onClick={() => open()}
                        className="absolute inset-0 bg-black/60 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Camera className="text-white" size={24} />
                      </div>
                    )}
                  </CldUploadWidget>
                </div>
                <div>
                  <CldUploadWidget 
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                    onSuccess={(result: any) => {
                       if (result.info && typeof result.info !== 'string') {
                        setImage(result.info.secure_url);
                      }
                    }}
                  >
                    {({ open }) => (
                      <Button variant="secondary" size="sm" className="mb-2" onClick={() => open()}>
                        Change Avatar
                      </Button>
                    )}
                  </CldUploadWidget>
                  <p className="text-xs text-zinc-500 font-medium">Powered by Cloudinary</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Display Name</label>
                  <Input 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Email Address</label>
                  <Input 
                    disabled
                    value={session?.user?.email || ""}
                    className="bg-zinc-900/50 cursor-not-allowed text-zinc-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Bio</label>
                  <textarea 
                    rows={4}
                    placeholder="Tell the world about yourself..."
                    className="w-full bg-zinc-950 border border-zinc-800 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-white resize-none"
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  className="w-full" 
                  size="lg" 
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? <Loader2 className="animate-spin mr-2" /> : <Save size={18} className="mr-2" />}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-red-500/5 border-red-500/10">
            <CardHeader>
              <CardTitle className="text-lg text-red-400">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-zinc-500">Deleting your account will permanently remove all your videos, playlists, and data. This action cannot be undone.</p>
              <Button variant="destructive">
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SettingsNavItem({ icon: Icon, label, active }: { icon: React.ElementType, label: string, active?: boolean }) {
  return (
    <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
      active ? "bg-zinc-800 text-white shadow-xl shadow-black/20 border border-zinc-700" : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
    }`}>
      <Icon size={18} />
      <span className="font-bold text-sm">{label}</span>
    </button>
  );
}
