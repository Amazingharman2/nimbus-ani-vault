import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchAnimeInfo, groupEpisodesBySeason, extractEpisodeSlug } from "@/lib/api";
import Navbar from "@/components/Navbar";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useState } from "react";
import { Play, Globe } from "lucide-react";

const AnimeDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [activeSeason, setActiveSeason] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ["anime", slug],
    queryFn: () => fetchAnimeInfo(slug!),
    enabled: !!slug,
  });

  const seasons = data ? groupEpisodesBySeason(data.episodes) : {};
  const seasonNumbers = Object.keys(seasons).map(Number).sort((a, b) => a - b);
  const currentEpisodes = seasons[activeSeason] || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {isLoading && <LoadingSpinner />}
      {error && <p className="text-destructive text-center py-20">Failed to load anime info.</p>}

      {data && (
        <main className="max-w-7xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row gap-6 mb-8 animate-fade-in-up">
            {data.image_url && data.image_url !== "N/A" && (
              <img src={data.image_url} alt={data.title} className="w-48 rounded-lg object-cover flex-shrink-0" />
            )}
            <div className="flex-1">
              <h1 className="font-display text-2xl sm:text-3xl font-bold mb-3">{data.title}</h1>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                  {data.total_episodes} Episodes
                </span>
                {data.languages.map((lang) => (
                  <span key={lang} className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Season tabs */}
          {seasonNumbers.length > 1 && (
            <div className="flex gap-2 mb-6 overflow-x-auto hide-scrollbar">
              {seasonNumbers.map((s) => (
                <button
                  key={s}
                  onClick={() => setActiveSeason(s)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0 ${
                    activeSeason === s
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-primary/20"
                  }`}
                >
                  Season {s}
                </button>
              ))}
            </div>
          )}

          {/* Episodes grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {currentEpisodes.map((ep, i) => {
              const epSlug = extractEpisodeSlug(ep.url);
              return (
                <Link
                  key={i}
                  to={`/watch/${epSlug}`}
                  className="group rounded-lg overflow-hidden bg-card border border-border hover:border-primary/50 transition-colors animate-fade-in-up"
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <div className="relative aspect-video">
                    <img src={ep.image_url} alt={ep.title} className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play className="w-8 h-8 text-primary" />
                    </div>
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-background/80 text-foreground">
                      EP {ep.episode_number}
                    </span>
                  </div>
                  <p className="p-2 text-xs line-clamp-2 text-muted-foreground group-hover:text-foreground transition-colors">
                    {ep.title}
                  </p>
                </Link>
              );
            })}
          </div>
        </main>
      )}
    </div>
  );
};

export default AnimeDetail;
