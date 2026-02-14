import { getApiBaseUrl, trackApiCall } from "./adminStore";

const getBaseUrl = () => getApiBaseUrl();

export interface HomeData {
  "Fresh Drops": AnimeCard[];
  "Most-Watched Films": AnimeCard[];
  "Most-Watched Series": AnimeCard[];
}

export interface AnimeCard {
  title: string;
  image: string;
  image_url?: string;
  link: string;
  episodes?: string;
}

export interface AnimeInfo {
  title: string;
  image_url: string;
  total_episodes: number;
  languages: string[];
  url: string;
  episodes: EpisodeItem[];
}

export interface EpisodeItem {
  episode_number: string;
  image_url: string;
  title: string;
  url: string;
}

export interface StreamData {
  episode_url: string;
  iframes: string[];
  m3u8_links: string[];
  total_streams: number;
  video_links: string[];
}

export interface SearchResult {
  title: string;
  image_url: string;
  link: string;
  categories: string;
}

export interface SearchResponse {
  count: number;
  results: SearchResult[];
}

export async function fetchHome(): Promise<HomeData> {
  trackApiCall();
  const res = await fetch(`${getBaseUrl()}/api/home`);
  if (!res.ok) throw new Error("Failed to fetch home data");
  return res.json();
}

export async function fetchAnimeInfo(slug: string): Promise<AnimeInfo> {
  trackApiCall();
  const res = await fetch(`${getBaseUrl()}/api/anime/series/${slug}/`);
  if (!res.ok) throw new Error("Failed to fetch anime info");
  return res.json();
}

export async function fetchStream(slug: string): Promise<StreamData> {
  trackApiCall();
  const res = await fetch(`${getBaseUrl()}/api/stream/${slug}/`);
  if (!res.ok) throw new Error("Failed to fetch stream");
  return res.json();
}

export async function searchAnime(query: string): Promise<SearchResponse> {
  trackApiCall();
  const res = await fetch(`${getBaseUrl()}/api/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Failed to search");
  return res.json();
}

// Extract slug from link like /series/naruto-shippuden/ or /movies/your-name/
export function extractSlug(link: string): string {
  const parts = link.replace(/^\/|\/$/g, "").split("/");
  return parts[parts.length - 1];
}

export function isMovie(link: string): boolean {
  return link.includes("/movies/");
}

// Parse episodes into seasons from URL pattern like slug-1x1, slug-2x1
export function groupEpisodesBySeason(episodes: EpisodeItem[]): Record<number, EpisodeItem[]> {
  const seasons: Record<number, EpisodeItem[]> = {};
  for (const ep of episodes) {
    const match = ep.url.match(/(\d+)x(\d+)\/?$/);
    const season = match ? parseInt(match[1]) : 1;
    if (!seasons[season]) seasons[season] = [];
    seasons[season].push(ep);
  }
  return seasons;
}

// Extract episode slug from url like /episode/naruto-1x1/
export function extractEpisodeSlug(url: string): string {
  const cleaned = url.replace(/^\/episode\/|\/$/g, "");
  return cleaned;
}
