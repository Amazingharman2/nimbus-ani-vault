import { useState, useEffect } from "react";
import { getActiveAnnouncements, type Announcement } from "@/lib/adminStore";
import { X, Info, AlertTriangle, CheckCircle } from "lucide-react";

const iconMap = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle,
};

const colorMap = {
  info: "bg-primary/10 border-primary/30 text-primary",
  warning: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
  success: "bg-green-500/10 border-green-500/30 text-green-400",
};

const AnnouncementBanner = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    setAnnouncements(getActiveAnnouncements());
  }, []);

  const visible = announcements.filter((a) => !dismissed.has(a.id));
  if (visible.length === 0) return null;

  return (
    <div className="space-y-2 px-4 py-2">
      {visible.map((a) => {
        const Icon = iconMap[a.type];
        return (
          <div
            key={a.id}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border text-sm ${colorMap[a.type]} animate-fade-in-up`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span className="flex-1">{a.message}</span>
            <button
              onClick={() => setDismissed((prev) => new Set(prev).add(a.id))}
              className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default AnnouncementBanner;
