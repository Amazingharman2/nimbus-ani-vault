import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchAnime, isMovie, extractSlug } from "@/lib/api";
import Navbar from "@/components/Navbar";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Link } from "react-router-dom";
import { Play } from "lucide-react";

const SearchPage = () => {
  const [params] = useSearchParams();
  const q = params.get("q") || "";

  const { data, isLoading } = useQuery({
    queryKey: ["search", q],
    queryFn: () => searchAnime(q),
    enabled: !!q,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="font-display text-2xl font-bold mb-6">
          Results for "<span className="text-primary">{q}</span>"
        </h1>

        {isLoading && <LoadingSpinner />}

        {data && data.results.length === 0 && (
          <p className="text-muted-foreground text-center py-20">No results found.</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {data?.results.map((item, i) => {
            const slug = extractSlug(item.link);
            const movie = isMovie(item.link);
            const to = movie ? `/watch/movies/${slug}` : `/anime/${slug}`;
            const img = item.image_url.startsWith("//") ? `https:${item.image_url}` : item.image_url;

            return (
              <Link key={i} to={to} className="group">
                <div className="relative overflow-hidden rounded-lg aspect-[2/3] bg-card">
                  <img src={img} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
                      <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">{item.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{item.categories}</p>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default SearchPage;
