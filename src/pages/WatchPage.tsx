import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchStream, fetchAnimeInfo, groupEpisodesBySeason, extractEpisodeSlug } from "@/lib/api";
import Navbar from "@/components/Navbar";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useState, useMemo } from "react";
import { Monitor, ArrowLeft, Tv, ChevronLeft, ChevronRight, List } from "lucide-react";

const WatchPage = () => {
  const { "*": slug } = useParams();
  const navigate = useNavigate();
  const [activeServer, setActiveServer] = useState(0);
  const [showEpList, setShowEpList] = useState(false);

  const isMovie = slug?.startsWith("movies/");
  const apiSlug = slug || "";

  const { data, isLoading, error } = useQuery({
    queryKey: ["stream", apiSlug],
    queryFn: () => fetchStream(apiSlug),
    enabled: !!apiSlug,
  });

  // Parse episode info from slug like "anime-name-1x5"
  const epInfo = useMemo(() => {
    const cleaned = apiSlug.replace(/^movies\//, "");
    const match = cleaned.match(/^(.+?)-(\d+)x(\d+)$/);
    if (match) {
      const name = match[1].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      return { name, season: parseInt(match[2]), episode: parseInt(match[3]), animeSlug: match[1] };
    }
    const name = cleaned.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return { name, season: null, episode: null, animeSlug: cleaned };
  }, [apiSlug]);

  const animeSlug = apiSlug.replace(/movies\//, "").replace(/-\d+x\d+$/, "");

  // Fetch anime info for episode navigation (only for series)
  const { data: animeData } = useQuery({
    queryKey: ["anime", animeSlug],
    queryFn: () => fetchAnimeInfo(animeSlug),
    enabled: !isMovie && !!animeSlug,
  });

  const seasons = animeData ? groupEpisodesBySeason(animeData.episodes) : {};
  const currentSeasonEps = epInfo.season ? (seasons[epInfo.season] || []) : [];

  // Find current episode index and compute prev/next
  const currentEpIndex = currentSeasonEps.findIndex((ep) => {
    const epSlug = extractEpisodeSlug(ep.url);
    return epSlug === apiSlug;
  });

  const prevEp = currentEpIndex > 0 ? currentSeasonEps[currentEpIndex - 1] : null;
  const nextEp = currentEpIndex >= 0 && currentEpIndex < currentSeasonEps.length - 1 ? currentSeasonEps[currentEpIndex + 1] : null;

  const iframes = data?.iframes || [];
  const defaultIndex = iframes.findIndex((url) => url.includes("as-cdn21.top"));
  const serverIndex = activeServer === 0 && defaultIndex >= 0 ? defaultIndex : activeServer;

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
          {isMovie && <p className="text-sm text-muted-foreground mt-1">Movie</p>}
        </div>

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

            {/* Episode navigation */}
            {!isMovie && currentSeasonEps.length > 0 && (
              <div className="mt-4 flex items-center justify-between gap-2">
                <button
                  disabled={!prevEp}
                  onClick={() => prevEp && navigate(`/watch/${extractEpisodeSlug(prevEp.url)}`)}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium bg-secondary text-secondary-foreground hover:bg-primary/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>

                <button
                  onClick={() => setShowEpList(!showEpList)}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium bg-secondary text-secondary-foreground hover:bg-primary/20 transition-colors"
                >
                  <List className="w-4 h-4" />
                  Episodes ({currentSeasonEps.length})
                </button>

                <button
                  disabled={!nextEp}
                  onClick={() => nextEp && navigate(`/watch/${extractEpisodeSlug(nextEp.url)}`)}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium bg-secondary text-secondary-foreground hover:bg-primary/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Episode list dropdown */}
            {showEpList && currentSeasonEps.length > 0 && (
              <div className="mt-2 max-h-60 overflow-y-auto rounded-lg border border-border bg-card p-2 space-y-1 animate-fade-in-up">
                {currentSeasonEps.map((ep, i) => {
                  const epSlug = extractEpisodeSlug(ep.url);
                  const isCurrent = epSlug === apiSlug;
                  return (
                    <button
                      key={i}
                      onClick={() => { navigate(`/watch/${epSlug}`); setShowEpList(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        isCurrent
                          ? "bg-primary/20 text-primary font-medium"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      EP {ep.episode_number} — {ep.title}
                    </button>
                  );
                })}
              </div>
            )}

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
