export interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

export interface Video {
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  hlsPath: string | null;
  duration: number | null;
  views: number;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  createdAt: Date | string;
  updatedAt: Date | string;
  userId: string;
  user?: Partial<User>;
}

export interface Playlist {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  userId: string;
  videos?: Video[];
}
