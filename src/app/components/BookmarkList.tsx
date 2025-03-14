"use client";

import { useState, useEffect } from 'react';

interface Tweet {
  id: string;
  text: string;
  created_at: string;
  author_id: string;
}

interface BookmarksResponse {
  data: Tweet[];
  includes?: {
    users: Array<{
      id: string;
      username: string;
    }>;
  };
}

export default function BookmarkList() {
  const [bookmarks, setBookmarks] = useState<BookmarksResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBookmarks() {
      try {
        const response = await fetch('/api/bookmarks');
        if (!response.ok) throw new Error('Failed to fetch bookmarks');
        const data = await response.json();
        setBookmarks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch bookmarks');
      } finally {
        setLoading(false);
      }
    }

    fetchBookmarks();
  }, []);

  if (loading) return <div>Loading bookmarks...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!bookmarks?.data) return <div>No bookmarks found</div>;

  return (
    <div className="space-y-4">
      {bookmarks.data.map((tweet) => {
        const author = bookmarks.includes?.users?.find(
          (user) => user.id === tweet.author_id
        );
        
        return (
          <div key={tweet.id} className="p-4 border rounded-lg shadow">
            <p className="mb-2">{tweet.text}</p>
            <div className="flex justify-between text-sm text-gray-500">
              <span>
                By: @{author?.username || 'unknown'}
              </span>
              <span>
                {new Date(tweet.created_at).toLocaleDateString()}
              </span>
              <a
                href={`https://twitter.com/i/web/status/${tweet.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View Tweet
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
} 