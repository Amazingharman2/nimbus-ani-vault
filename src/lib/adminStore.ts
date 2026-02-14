// localStorage-based admin configuration store

const ADMIN_PASSWORD = "admin123"; // Change this to your desired password
const STORAGE_KEYS = {
  auth: "admin_authenticated",
  maintenance: "maintenance_mode",
  apiBaseUrl: "api_base_url",
  announcements: "site_announcements",
  pageViews: "page_views",
  apiCalls: "api_call_count",
  dailyViews: "daily_views",
};

const DEFAULT_API_URL = "https://anime-hindibaapiking.onrender.com";

// Auth
export function adminLogin(password: string): boolean {
  if (password === ADMIN_PASSWORD) {
    sessionStorage.setItem(STORAGE_KEYS.auth, "true");
    return true;
  }
  return false;
}

export function isAdminAuthenticated(): boolean {
  return sessionStorage.getItem(STORAGE_KEYS.auth) === "true";
}

export function adminLogout(): void {
  sessionStorage.removeItem(STORAGE_KEYS.auth);
}

// Maintenance Mode
export function isMaintenanceMode(): boolean {
  return localStorage.getItem(STORAGE_KEYS.maintenance) === "true";
}

export function setMaintenanceMode(enabled: boolean): void {
  localStorage.setItem(STORAGE_KEYS.maintenance, String(enabled));
}

// API Base URL
export function getApiBaseUrl(): string {
  return localStorage.getItem(STORAGE_KEYS.apiBaseUrl) || DEFAULT_API_URL;
}

export function setApiBaseUrl(url: string): void {
  localStorage.setItem(STORAGE_KEYS.apiBaseUrl, url);
}

// Announcements
export interface Announcement {
  id: string;
  message: string;
  type: "info" | "warning" | "success";
  active: boolean;
  createdAt: string;
}

export function getAnnouncements(): Announcement[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.announcements) || "[]");
  } catch {
    return [];
  }
}

export function saveAnnouncements(announcements: Announcement[]): void {
  localStorage.setItem(STORAGE_KEYS.announcements, JSON.stringify(announcements));
}

export function getActiveAnnouncements(): Announcement[] {
  return getAnnouncements().filter((a) => a.active);
}

// Analytics (localStorage-based, approximate)
function getTodayKey(): string {
  return new Date().toISOString().split("T")[0];
}

export function trackPageView(): void {
  const total = parseInt(localStorage.getItem(STORAGE_KEYS.pageViews) || "0", 10);
  localStorage.setItem(STORAGE_KEYS.pageViews, String(total + 1));

  // Daily tracking
  const dailyData = getDailyViews();
  const today = getTodayKey();
  dailyData[today] = (dailyData[today] || 0) + 1;
  localStorage.setItem(STORAGE_KEYS.dailyViews, JSON.stringify(dailyData));
}

export function trackApiCall(): void {
  const total = parseInt(localStorage.getItem(STORAGE_KEYS.apiCalls) || "0", 10);
  localStorage.setItem(STORAGE_KEYS.apiCalls, String(total + 1));
}

export function getTotalPageViews(): number {
  return parseInt(localStorage.getItem(STORAGE_KEYS.pageViews) || "0", 10);
}

export function getTotalApiCalls(): number {
  return parseInt(localStorage.getItem(STORAGE_KEYS.apiCalls) || "0", 10);
}

export function getDailyViews(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.dailyViews) || "{}");
  } catch {
    return {};
  }
}

export function getTodayViews(): number {
  const daily = getDailyViews();
  return daily[getTodayKey()] || 0;
}

export function resetAnalytics(): void {
  localStorage.setItem(STORAGE_KEYS.pageViews, "0");
  localStorage.setItem(STORAGE_KEYS.apiCalls, "0");
  localStorage.setItem(STORAGE_KEYS.dailyViews, "{}");
}
