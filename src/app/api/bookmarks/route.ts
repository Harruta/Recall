import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/db";
import Bookmark from "@/models/Bookmark";

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    
    const bookmarks = await Bookmark.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(100);

    return NextResponse.json({ bookmarks });
  } catch (error: any) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookmarks" },
      { status: 500 }
    );
  }
} 