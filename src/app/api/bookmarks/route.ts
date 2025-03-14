import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createTwitterClient } from "@/lib/twitter-client";

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = createTwitterClient(session.accessToken as string);
    
    // Get the user ID
    const { data: { id } } = await client.users.findMyUser();

    // Get bookmarks with parameters
    const params = {
      expansions: ["author_id"],
      "user.fields": ["username", "created_at"],
      "tweet.fields": ["created_at", "entities", "context_annotations"],
    };

    const bookmarks = await client.bookmarks.getUsersIdBookmarks(id, params);
    
    return NextResponse.json(bookmarks);
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookmarks" },
      { status: 500 }
    );
  }
} 