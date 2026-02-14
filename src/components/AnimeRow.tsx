import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AnimeCardItem from "./AnimeCardItem";

interface AnimeItem {
  title: string;
  image?: string;
  image_url?: string;
  link: string;
  episodes?: string;
}

interface Props {
  title: string;
  items: AnimeItem[];
}

const AnimeRow = ({ title, items }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      const amount = dir === "left" ? -400 : 400;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <section className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg sm:text-xl font-bold text-foreground">{title}</h2>
        <div className="flex gap-1">
          <button onClick={() => scroll("left")} className="p-1.5 rounded-md bg-secondary hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => scroll("right")} className="p-1.5 rounded-md bg-secondary hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
        {items.map((item, i) => (
          <AnimeCardItem
            key={`${item.title}-${i}`}
            title={item.title}
            image={item.image || item.image_url || ""}
            link={item.link}
            episodes={item.episodes}
          />
        ))}
      </div>
    </section>
  );
};

export default AnimeRow;
