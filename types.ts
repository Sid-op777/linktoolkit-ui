export interface ShortLink {
  id: string;
  shortUrl: string;
  longUrl: string;
  totalClicks: number;
  createdAt: string; 
  expiresAt: string;
}

export interface AnalyticsData {
  id: string;
  longUrl: string;
  shortUrl: string;
  totalClicks: number;
  clickTrend: { date: string; clicks: number }[];
  referrers: { name: string; count: number }[];
  devices: { name: string; count: number }[];
  locations: { name: string; count: number }[];
}

export interface UTMParams {
  baseUrl: string;
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}

// API Request/Response types
export interface ShortenApiRequest {
  longUrl: string;
  alias?: string;
  expiry? : string;
}

export interface ShortenApiResponse {
  shortUrl: string;
  longUrl: string;
  expiresAt: string;
}

export interface QRCodeApiRequest {
  url: string;
}

export interface QRCodeApiResponse {
  shortUrl: string;
  qrCodeUrl: string; 
}

// Toast types
export enum ToastType {
  Success = 'success',
  Error = 'error',
  Info = 'info',
}

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}
