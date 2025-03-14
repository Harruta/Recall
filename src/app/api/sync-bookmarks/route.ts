import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import axios from "axios";
import dbConnect from "@/lib/db";
import Bookmark from "@/models/Bookmark";

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.accessToken || !session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    let bookmarks = [];
    let pagination_token = undefined;
    
    do {
      const response = await axios.get(
        `https://api.twitter.com/2/users/${session.user.id}/bookmarks`,
        {
          headers: { Authorization: `Bearer ${session.user.accessToken}` },
          params: {
            pagination_token,
            "tweet.fields": "created_at,author_id",
            max_results: 100
          }
        }
      );

      bookmarks = [...bookmarks, ...response.data.data];
      pagination_token = response.data?.meta?.next_token;
    } while (pagination_token);

    const operations = bookmarks.map(bookmark => ({
      updateOne: {
        filter: { userId: session.user.id, tweetId: bookmark.id },
        update: {
          $set: {
            text: bookmark.text,
            createdAt: new Date(bookmark.created_at),
            authorId: bookmark.author_id
          }
        },
        upsert: true
      }
    }));

    await Bookmark.bulkWrite(operations);

    return NextResponse.json({ 
      message: `Successfully synced ${bookmarks.length} bookmarks`,
      count: bookmarks.length 
    });
  } catch (error: any) {
    console.error("Error syncing bookmarks:", error);
    const status = error.response?.status || 500;
    const message = error.response?.data?.error || error.message;
    return NextResponse.json({ error: message }, { status });
  }
} 