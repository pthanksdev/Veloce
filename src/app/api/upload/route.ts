import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { transcodeToHLS, generateThumbnail } from "@/lib/ffmpeg";
import path from "path";
import fs from "fs";
import { pipeline } from "stream";
import { promisify } from "util";

const pump = promisify(pipeline);

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("video") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const videoId = Math.random().toString(36).substring(7);
    const fileName = `${videoId}-${file.name}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadDir, fileName);

    // Ensure upload dir exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Save file to disk
    const stream = file.stream();
    // @ts-ignore - ReadableStream to Node Readable conversion
    await pump(stream, fs.createWriteStream(filePath));

    // Create DB record
    const video = await prisma.video.create({
      data: {
        id: videoId,
        title,
        description,
        status: "PROCESSING",
        userId: session.user.id,
      },
    });

    // Start background processing
    const processedDir = path.join(process.cwd(), "public", "processed");
    
    // We don't await this to return the response quickly, but in a real app,
    // this would be a background job (BullMQ, etc.)
    (async () => {
      try {
        const [hlsPath, thumbnailUrl] = await Promise.all([
          transcodeToHLS(filePath, processedDir, videoId),
          generateThumbnail(filePath, processedDir, videoId),
        ]);

        await prisma.video.update({
          where: { id: videoId },
          data: {
            hlsPath,
            thumbnailUrl,
            status: "COMPLETED",
          },
        });

        // Cleanup original file
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error("Processing error:", err);
        await prisma.video.update({
          where: { id: videoId },
          data: { status: "FAILED" },
        });
      }
    })();

    return NextResponse.json({ success: true, videoId });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
