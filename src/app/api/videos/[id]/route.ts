import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const video = await prisma.video.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Increment views
    await prisma.video.update({
      where: { id: params.id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json(video);
  } catch (error) {
    console.error("Fetch video error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
