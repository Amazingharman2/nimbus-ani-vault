import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchStream } from "@/lib/api";
import Navbar from "@/components/Navbar";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useState } from "react";
import { Monitor, ArrowLeft, Tv } from "lucide-react";
import { Link } from "react-router-dom";

const WatchPage = () => {
  const { "*": slug } = useParams();
  const [activeServer, setActiveServer] = useState(0);

  const isMovie = slug?.startsWith("movies/");
  const apiSlug = slug || "";

  const { data, isLoading, error } = useQuery({
    queryKey: ["stream", apiSlug],
    queryFn: () => fetchStream(apiSlug),
    enabled: !!apiSlug,
  });

  const iframes = data?.iframes || [];

  const defaultIndex = iframes.findIndex((url) => url.includes("as-cdn21.top"));
  const initialServer = defaultIndex >= 0 ? defaultIndex : 0;
  const serverIndex = activeServer === 0 && defaultIndex >= 0 ? defaultIndex : activeServer;

  // Parse episode info from slug like "anime-name-1x5"
  const parseEpisodeInfo = (s: string) => {
    const cleaned = s.replace(/^movies\//, "");
    const match = cleaned.match(/^(.+?)-(\d+)x(\d+)$/);
    if (match) {
      const name = match[1].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      return { name, season: parseInt(match[2]), episode: parseInt(match[3]) };
    }
    // Fallback: just format the slug
    const name = cleaned.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return { name, season: null, episode: null };
  };

  const epInfo = parseEpisodeInfo(apiSlug);
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

        {/* Episode info header */}
        <div className="mb-4 animate-fade-in-up">
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Tv className="w-5 h-5 text-primary" />
            {epInfo.name}
          </h1>
          {epInfo.season !== null && epInfo.episode !== null && (
            <p className="text-sm text-muted-foreground mt-1">
              Season {epInfo.season} • Episode {epInfo.episode}
            </p>
          )}
          {isMovie && (
            <p className="text-sm text-muted-foreground mt-1">Movie</p>
          )}
        </div>

        {isLoading && <LoadingSpinner />}
        {error && <p className="text-destructive text-center py-20">Failed to load stream.</p>}

        {data && iframes.length > 0 && (
          <div className="animate-fade-in-up">
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
                      Server {i + 1}
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
