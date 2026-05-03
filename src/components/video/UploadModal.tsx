"use client";

import { useState, useRef } from "react";
import { X, Upload, FileVideo, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "completed" | "error">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setTitle(e.target.files[0].name.split(".")[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setStatus("uploading");
    setProgress(0);

    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", title);
    formData.append("description", description);

    try {
      const response = await axios.post("/api/upload", formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setProgress(percentCompleted);
          if (percentCompleted === 100) {
            setStatus("processing");
          }
        },
      });

      setStatus("completed");
      setTimeout(() => {
        onClose();
        setStatus("idle");
        setFile(null);
        setTitle("");
        setDescription("");
      }, 2000);
    } catch (error) {
      console.error("Upload failed:", error);
      setStatus("error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-zinc-950/80 backdrop-blur-xl">
      <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900/50">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Upload size={20} className="text-indigo-400" />
            Upload Video
          </h3>
          <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-xl transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          {!file ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-zinc-800 rounded-3xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group"
            >
              <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileVideo size={40} className="text-zinc-500 group-hover:text-indigo-400" />
              </div>
              <p className="text-white font-bold text-lg mb-2">Select video file to upload</p>
              <p className="text-zinc-500 text-sm">Or drag and drop a file</p>
              <p className="text-zinc-600 text-xs mt-6 font-medium uppercase tracking-widest">MP4, MOV, or WebM up to 500MB</p>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="video/*" className="hidden" />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
                <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center text-indigo-400">
                  <FileVideo size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{file.name}</p>
                  <p className="text-xs text-zinc-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
                <button onClick={() => setFile(null)} className="text-zinc-500 hover:text-red-400 p-2 transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Video Title</label>
                  <Input 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Add a title that catches attention"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Description</label>
                  <textarea 
                    rows={4}
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell viewers about your video..."
                    className="w-full bg-zinc-950 border border-zinc-800 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-white resize-none"
                  />
                </div>
              </div>

              {status !== "idle" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                    <span className={status === "error" ? "text-red-400" : "text-indigo-400"}>
                      {status === "uploading" && `Uploading... ${progress}%`}
                      {status === "processing" && "Processing with FFmpeg..."}
                      {status === "completed" && "Upload Complete!"}
                      {status === "error" && "Upload Failed"}
                    </span>
                    {status === "processing" && <Loader2 size={14} className="animate-spin" />}
                    {status === "completed" && <CheckCircle2 size={16} className="text-green-500" />}
                    {status === "error" && <AlertCircle size={16} className="text-red-500" />}
                  </div>
                  <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                    <div 
                      className={cn(
                        "h-full transition-all duration-300",
                        status === "error" ? "bg-red-500" : "bg-indigo-500"
                      )}
                      style={{ width: `${status === "processing" || status === "completed" ? 100 : progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <Button 
                  onClick={onClose}
                  disabled={isUploading}
                  variant="secondary"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpload}
                  disabled={isUploading || !title}
                  className="flex-[2]"
                >
                  {isUploading ? (
                    <><Loader2 size={18} className="animate-spin" /> {status === "processing" ? "Processing..." : "Uploading..."}</>
                  ) : "Publish Video"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
