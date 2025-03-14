"use client";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const handleSignIn = async () => {
    try {
      const result = await signIn("twitter", {
        callbackUrl: "/dashboard",
        redirect: true,
      });
      
      console.log("Sign in result:", result);
      
      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      console.error("Sign in error:", err);
      setError(err instanceof Error ? err.message : "Failed to sign in");
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-8">Twitter Bookmark Manager</h1>
        {!session && (
          <>
            <button
              onClick={handleSignIn}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Sign in with Twitter
            </button>
            {error && (
              <p className="mt-4 text-red-500">
                Error: {error}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
