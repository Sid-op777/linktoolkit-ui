
export interface ShortLink {
  id: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  createdAt: string; // ISO date string
  expiry?: string; // ISO date string or human-readable
}

export interface AnalyticsData {
  linkId: string;
  originalUrl: string;
  shortUrl: string;
  totalClicks: number;
  referrers: { source: string; count: number }[];
  devices: { type: string; count: number }[];
  locations: { country: string; count: number }[];
  clickTrend: { date: string; clicks: number }[];
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
  url: string;
  alias?: string;
}

export interface ShortenApiResponse {
  id: string;
  shortUrl: string;
  originalUrl: string;
  createdAt: string;
  expiry?: string;
}

export interface QRCodeApiRequest {
  url: string;
}

export interface QRCodeApiResponse {
  qrCodeUrl: string; // URL to the QR image
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
