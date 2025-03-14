"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

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
    } catch (error) {
      setMessage(`Error syncing bookmarks: ${(error as Error).message}`);
    }

    setSyncing(false);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Twitter Bookmarks Sync</h1>

      {status === "loading" ? (
        <p>Loading...</p>
      ) : !session ? (
        <button onClick={() => signIn("twitter")}>Sign in with Twitter</button>
      ) : (
        <>
          <p>Signed in as {session.user?.name || "Unknown User"}</p>
          <button onClick={() => signOut()} disabled={syncing}>
            Sign out
          </button>
          <br />
          <button onClick={syncBookmarks} disabled={syncing}>
            {syncing ? "Syncing..." : "Sync Bookmarks"}
          </button>
          {message && <p>{message}</p>}
        </>
      )}
    </div>
  );
}
