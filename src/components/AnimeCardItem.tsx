import { Link } from "react-router-dom";
import { isMovie, extractSlug } from "@/lib/api";
import { Play } from "lucide-react";

interface Props {
  title: string;
  image: string;
  link: string;
  episodes?: string;
}

const AnimeCardItem = ({ title, image, link, episodes }: Props) => {
  const slug = extractSlug(link);
  const movie = isMovie(link);
  const to = movie ? `/watch/movies/${slug}` : `/anime/${slug}`;

  return (
    <Link to={to} className="group block flex-shrink-0 w-[160px] sm:w-[180px]">
      <div className="relative overflow-hidden rounded-lg aspect-[2/3] bg-card">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center animate-pulse-glow">
            <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
          </div>
        </div>
        {episodes && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-medium bg-primary text-primary-foreground">
            {episodes}
          </div>
        )}
      </div>
      <p className="mt-2 text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
        {title}
      </p>
    </Link>
  );
};

export default AnimeCardItem;
