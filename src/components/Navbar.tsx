import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { getSiteName } from "@/lib/adminStore";

const Navbar = () => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const siteName = getSiteName();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link to="/" className="font-display text-xl font-bold text-primary tracking-tight flex-shrink-0">
          {siteName}
        </Link>

        {/* Desktop search */}
        <form onSubmit={handleSearch} className="hidden sm:flex items-center bg-secondary rounded-lg overflow-hidden max-w-md flex-1 mx-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search anime..."
            className="bg-transparent px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1"
          />
          <button type="submit" className="px-3 py-2 text-muted-foreground hover:text-primary transition-colors">
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Mobile search toggle */}
        <button onClick={() => setOpen(!open)} className="sm:hidden text-muted-foreground hover:text-primary">
          {open ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile search bar */}
      {open && (
        <form onSubmit={handleSearch} className="sm:hidden px-4 pb-3">
          <div className="flex items-center bg-secondary rounded-lg overflow-hidden">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search anime..."
              autoFocus
              className="bg-transparent px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1"
            />
            <button type="submit" className="px-3 py-2 text-muted-foreground hover:text-primary">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
    </nav>
  );
};

export default Navbar;
