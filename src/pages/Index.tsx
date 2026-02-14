import { useQuery } from "@tanstack/react-query";
import { fetchHome } from "@/lib/api";
import Navbar from "@/components/Navbar";
import AnimeRow from "@/components/AnimeRow";
import LoadingSpinner from "@/components/LoadingSpinner";

const Index = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["home"],
    queryFn: fetchHome,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        {isLoading && <LoadingSpinner />}
        {error && (
          <div className="text-center py-20 text-destructive">
            Failed to load. Please try again.
          </div>
        )}
        {data && (
          <>
            <AnimeRow title="🔥 Fresh Drops" items={data["Fresh Drops"] || []} />
            <AnimeRow title="🎬 Most-Watched Films" items={data["Most-Watched Films"] || []} />
            <AnimeRow title="📺 Most-Watched Series" items={data["Most-Watched Series"] || []} />
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
