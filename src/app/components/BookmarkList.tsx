"use client";

import { useState, useEffect } from 'react';

interface Bookmark {
  tweetId: string;
  text: string;
  createdAt: string;
  authorId: string;
}

export default function BookmarkList() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchBookmarks = async () => {
    try {
      const response = await fetch('/api/bookmarks');
      if (!response.ok) throw new Error('Failed to fetch bookmarks');
      const data = await response.json();
      setBookmarks(data.bookmarks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bookmarks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const filteredBookmarks = bookmarks.filter(bookmark =>
    bookmark.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading bookmarks...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      <input
        type="search"
        placeholder="Search bookmarks..."
        className="w-full p-2 border rounded"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      <div className="grid gap-4">
        {filteredBookmarks.map((bookmark) => (
          <div key={bookmark.tweetId} className="p-4 border rounded shadow">
            <p className="mb-2">{bookmark.text}</p>
            <div className="flex justify-between text-sm text-gray-500">
              <span>{new Date(bookmark.createdAt).toLocaleDateString()}</span>
              <a
                href={`https://twitter.com/i/web/status/${bookmark.tweetId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View Tweet
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 