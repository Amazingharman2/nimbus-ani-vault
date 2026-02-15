import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  isAdminAuthenticated,
  adminLogout,
  isMaintenanceMode,
  setMaintenanceMode,
  getApiBaseUrl,
  setApiBaseUrl,
  getAnnouncements,
  saveAnnouncements,
  getTotalPageViews,
  getTotalApiCalls,
  getTodayViews,
  resetAnalytics,
  getSiteName,
  setSiteName,
  getMaintenanceMessage,
  setMaintenanceMessage,
  type Announcement,
} from "@/lib/adminStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LogOut,
  Wrench,
  Globe,
  Megaphone,
  BarChart3,
  Plus,
  Trash2,
  RotateCcw,
  Eye,
  Activity,
  CalendarDays,
  Type,
  MessageSquare,
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdminAuthenticated()) navigate("/admin");
  }, [navigate]);

  // Maintenance
  const [maintenance, setMaintenance] = useState(isMaintenanceMode());
  const [maintMsg, setMaintMsg] = useState(getMaintenanceMessage());
  const [maintMsgSaved, setMaintMsgSaved] = useState(false);

  // Site Name
  const [name, setName] = useState(getSiteName());
  const [nameSaved, setNameSaved] = useState(false);

  // API URL
  const [apiUrl, setApiUrl] = useState(getApiBaseUrl());
  const [apiSaved, setApiSaved] = useState(false);

  // Announcements
  const [announcements, setAnnouncementsState] = useState<Announcement[]>(getAnnouncements());
  const [newMsg, setNewMsg] = useState("");
  const [newType, setNewType] = useState<"info" | "warning" | "success">("info");

  // Analytics
  const [totalViews, setTotalViews] = useState(getTotalPageViews());
  const [totalApi, setTotalApi] = useState(getTotalApiCalls());
  const [todayViews, setTodayViews] = useState(getTodayViews());

  const handleMaintenanceToggle = (checked: boolean) => {
    setMaintenance(checked);
    setMaintenanceMode(checked);
  };

  const handleSaveMaintMsg = () => {
    setMaintenanceMessage(maintMsg);
    setMaintMsgSaved(true);
    setTimeout(() => setMaintMsgSaved(false), 2000);
  };

  const handleSaveName = () => {
    setSiteName(name);
    setNameSaved(true);
    setTimeout(() => setNameSaved(false), 2000);
  };

  const handleSaveApi = () => {
    setApiBaseUrl(apiUrl);
    setApiSaved(true);
    setTimeout(() => setApiSaved(false), 2000);
  };

  const handleAddAnnouncement = () => {
    if (!newMsg.trim()) return;
    const updated = [
      ...announcements,
      { id: Date.now().toString(), message: newMsg.trim(), type: newType, active: true, createdAt: new Date().toISOString() },
    ];
    setAnnouncementsState(updated);
    saveAnnouncements(updated);
    setNewMsg("");
  };

  const toggleAnnouncement = (id: string) => {
    const updated = announcements.map((a) => (a.id === id ? { ...a, active: !a.active } : a));
    setAnnouncementsState(updated);
    saveAnnouncements(updated);
  };

  const deleteAnnouncement = (id: string) => {
    const updated = announcements.filter((a) => a.id !== id);
    setAnnouncementsState(updated);
    saveAnnouncements(updated);
  };

  const handleResetAnalytics = () => {
    resetAnalytics();
    setTotalViews(0);
    setTotalApi(0);
    setTodayViews(0);
  };

  const handleLogout = () => {
    adminLogout();
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Wrench className="w-5 h-5 text-primary" />
            Admin Panel
          </h1>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-1" /> Logout
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Analytics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Eye className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalViews}</p>
                <p className="text-xs text-muted-foreground">Total Page Views</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{todayViews}</p>
                <p className="text-xs text-muted-foreground">Today's Views</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalApi}</p>
                <p className="text-xs text-muted-foreground">API Calls</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={handleResetAnalytics}>
            <RotateCcw className="w-3 h-3 mr-1" /> Reset Analytics
          </Button>
        </div>

        {/* Site Name */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Type className="w-4 h-4 text-primary" />
              Site Name
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your site name" className="bg-background border-border" />
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={handleSaveName}>Save</Button>
              {nameSaved && <span className="text-xs text-green-400">Saved! Reload to see changes.</span>}
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Mode */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Wrench className="w-4 h-4 text-primary" />
              Maintenance Mode
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {maintenance ? "Site is in maintenance mode." : "Site is live and accessible."}
              </p>
              <Switch checked={maintenance} onCheckedChange={handleMaintenanceToggle} />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground flex items-center gap-1">
                <MessageSquare className="w-3 h-3" /> Maintenance Message
              </label>
              <Input value={maintMsg} onChange={(e) => setMaintMsg(e.target.value)} placeholder="Custom maintenance message..." className="bg-background border-border" />
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={handleSaveMaintMsg}>Save Message</Button>
                {maintMsgSaved && <span className="text-xs text-green-400">Saved!</span>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Base URL */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              API Base URL
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} placeholder="https://your-api.com" className="bg-background border-border" />
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={handleSaveApi}>Save</Button>
              {apiSaved && <span className="text-xs text-green-400">Saved! Reload to apply.</span>}
            </div>
          </CardContent>
        </Card>

        {/* Announcements */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-primary" />
              Announcements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input value={newMsg} onChange={(e) => setNewMsg(e.target.value)} placeholder="Type announcement..." className="bg-background border-border flex-1" onKeyDown={(e) => e.key === "Enter" && handleAddAnnouncement()} />
              <select value={newType} onChange={(e) => setNewType(e.target.value as "info" | "warning" | "success")} className="bg-background border border-border rounded-md px-2 text-sm text-foreground">
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="success">Success</option>
              </select>
              <Button size="sm" onClick={handleAddAnnouncement}><Plus className="w-4 h-4" /></Button>
            </div>
            {announcements.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No announcements yet.</p>}
            <div className="space-y-2">
              {announcements.map((a) => (
                <div key={a.id} className={`flex items-center gap-3 px-3 py-2 rounded-lg border ${a.active ? "border-primary/30 bg-primary/5" : "border-border bg-muted/30 opacity-60"}`}>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${a.type === "info" ? "bg-primary/20 text-primary" : a.type === "warning" ? "bg-yellow-500/20 text-yellow-400" : "bg-green-500/20 text-green-400"}`}>{a.type}</span>
                  <span className="flex-1 text-sm text-foreground">{a.message}</span>
                  <Switch checked={a.active} onCheckedChange={() => toggleAnnouncement(a.id)} />
                  <button onClick={() => deleteAnnouncement(a.id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              Quick Info
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">⚠️ Analytics are localStorage-based (tracked per device). Admin pages are excluded from tracking.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
