import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "COMPLETED";

    const videos = await prisma.video.findMany({
      where: { status },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(videos);
  } catch (error) {
    console.error("Fetch videos error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
