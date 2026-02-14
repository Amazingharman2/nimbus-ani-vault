import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchStream } from "@/lib/api";
import Navbar from "@/components/Navbar";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useState } from "react";
import { Monitor, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const WatchPage = () => {
  const { "*": slug } = useParams();
  const [activeServer, setActiveServer] = useState(0);

  // Handle movie URLs: /watch/movies/slug -> movies/slug for API
  const isMovie = slug?.startsWith("movies/");
  const apiSlug = slug || "";

  const { data, isLoading, error } = useQuery({
    queryKey: ["stream", apiSlug],
    queryFn: () => fetchStream(apiSlug),
    enabled: !!apiSlug,
  });

  const iframes = data?.iframes || [];

  // Find default server (as-cdn21.top) or use first
  const defaultIndex = iframes.findIndex((url) => url.includes("as-cdn21.top"));
  const initialServer = defaultIndex >= 0 ? defaultIndex : 0;

  // Use initial server on first render
  const serverIndex = activeServer === 0 && defaultIndex >= 0 ? defaultIndex : activeServer;

  const serverNames = iframes.map((_, i) => `Server ${i + 1}`);

  // Extract anime slug for back link
  const animeSlug = apiSlug.replace(/movies\//, "").replace(/-\d+x\d+$/, "");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-4">
        {/* Back button */}
        {!isMovie && (
          <Link to={`/anime/${animeSlug}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to episodes
          </Link>
        )}

        {isLoading && <LoadingSpinner />}
        {error && <p className="text-destructive text-center py-20">Failed to load stream.</p>}

        {data && iframes.length > 0 && (
          <div className="animate-fade-in-up">
            {/* Player */}
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-card border border-border">
              <iframe
                src={iframes[serverIndex]}
                className="w-full h-full"
                allowFullScreen
                allow="autoplay; fullscreen; encrypted-media"
                sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
                referrerPolicy="no-referrer"
                title="Video Player"
              />
            </div>

            {/* Server selector */}
            {iframes.length > 1 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
                  <Monitor className="w-4 h-4" />
                  Select Server
                </p>
                <div className="flex flex-wrap gap-2">
                  {iframes.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveServer(i)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        serverIndex === i
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-primary/20"
                      }`}
                    >
                      {serverNames[i]}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {data && iframes.length === 0 && (
          <p className="text-center text-muted-foreground py-20">No streams available for this episode.</p>
        )}
      </main>
    </div>
  );
};

export default WatchPage;
