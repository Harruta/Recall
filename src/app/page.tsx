"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import BookmarkList from "./components/BookmarkList";

export default function Home() {
  const { data: session, status } = useSession();
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState("");

  const syncBookmarks = async () => {
    setSyncing(true);
    setMessage("");

    try {
      const res = await fetch("/api/sync-bookmarks");
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${await res.text()}`);
      }

      const data = await res.json();
      setMessage(data.message || "Sync complete");
      // Refresh the page to show new bookmarks
      window.location.reload();
    } catch (error) {
      setMessage(`Error syncing bookmarks: ${(error as Error).message}`);
    }

    setSyncing(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Twitter Bookmarks Sync</h1>

      {status === "loading" ? (
        <p>Loading...</p>
      ) : !session ? (
        <button 
          onClick={() => signIn("twitter")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Sign in with Twitter
        </button>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p>Signed in as {session.user?.name || "Unknown User"}</p>
            <div className="space-x-2">
              <button 
                onClick={syncBookmarks} 
                disabled={syncing}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
              >
                {syncing ? "Syncing..." : "Sync Bookmarks"}
              </button>
              <button 
                onClick={() => signOut()} 
                disabled={syncing}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-gray-400"
              >
                Sign out
              </button>
            </div>
          </div>
          
          {message && (
            <div className="bg-blue-100 border-blue-500 text-blue-700 px-4 py-2 rounded">
              {message}
            </div>
          )}

          <BookmarkList />
        </div>
      )}
    </div>
  );
}
