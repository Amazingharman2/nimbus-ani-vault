import { Construction } from "lucide-react";
import { getMaintenanceMessage, getSiteName } from "@/lib/adminStore";
import AnnouncementBanner from "@/components/AnnouncementBanner";

const MaintenancePage = () => {
  const message = getMaintenanceMessage();
  const siteName = getSiteName();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AnnouncementBanner />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center max-w-md animate-fade-in-up">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Construction className="w-10 h-10 text-primary animate-pulse-glow" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">{siteName} — Under Maintenance</h1>
          <p className="text-muted-foreground text-lg mb-6">{message}</p>
          <div className="flex justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full bg-primary animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
