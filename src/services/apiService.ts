import fetchWithRefresh from './apiClient'; 
import { ShortLink, AnalyticsData, ShortenApiRequest, ShortenApiResponse, QRCodeApiRequest, QRCodeApiResponse, UTMParams } from '../../types';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || '';

export const shortenUrl = async (data: ShortenApiRequest): Promise<ShortenApiResponse> => {
  
  const response = await fetchWithRefresh(`${BASE_URL}/api/links`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to shorten URL: ${response.status}`);
  }

  return response.json() as Promise<ShortenApiResponse>;
};

export const getShortLinks = async (): Promise<ShortLink[]> => {
  const res = await fetchWithRefresh(`${BASE_URL}/api/links`);
 
  if (!res.ok) {
    throw new Error('Failed to fetch short links');
  }

  const data: ShortLink[] = await res.json();
  return data;
};

export const getLinkDetails = async (shortUrl: string): Promise<ShortLink> => {
  const alias = extractAliasFromUrl(shortUrl);
  const res = await fetchWithRefresh(`${BASE_URL}/api/links/l?alias=${encodeURIComponent(alias)}`);

  if (!res.ok) {
    throw new Error(`Failed to fetch link details: ${res.status}`);
  }

  return await res.json();
};

const extractAliasFromUrl = (shortUrl: string): string => {
  try {
    const url = new URL(shortUrl);
    return url.pathname.replace(/^\/+/, '');
  } catch {
    return shortUrl.split('/').pop() || '';
  }
};

export const getAnalyticsForLink = async (linkId: string): Promise<AnalyticsData | null> => {
  const res = await fetchWithRefresh(`${BASE_URL}/api/links/${encodeURIComponent(linkId)}/analytics`);

  if (!res.ok) {
    throw new Error(`Failed to fetch link analytics: ${res.status}`);
  }

  const data: AnalyticsData = await res.json();
  return data;
};

export const generateQRCode = async (data: QRCodeApiRequest): Promise<QRCodeApiResponse> => {
  const res = await fetchWithRefresh(`${BASE_URL}/api/qrcode`, {
    method: 'POST',
    body: JSON.stringify({
      longUrl: data.url
    }),
  });  

  if (!res.ok) {
    throw new Error(`Failed to generate QR code: ${res.status}`);
  }

  const response: QRCodeApiResponse = await res.json();
  return response;
};

export const buildUtmUrl = async (params: UTMParams): Promise<{ utmUrl: string }> => {
  return new Promise((resolve) => {
    let url = params.baseUrl;
      if (!url.includes('?')) {
        url += '?';
      } else if (!url.endsWith('&') && !url.endsWith('?')) {
        url += '&';
      }
      
      const queryParams = [];
      if (params.source) queryParams.push(`utm_source=${encodeURIComponent(params.source)}`);
      if (params.medium) queryParams.push(`utm_medium=${encodeURIComponent(params.medium)}`);
      if (params.campaign) queryParams.push(`utm_campaign=${encodeURIComponent(params.campaign)}`);
      if (params.term) queryParams.push(`utm_term=${encodeURIComponent(params.term)}`);
      if (params.content) queryParams.push(`utm_content=${encodeURIComponent(params.content)}`);
      
      let finalUrl = url + queryParams.join('&');
      // Clean up trailing '?' or '&' if no params were added
      if (finalUrl.endsWith('?') || finalUrl.endsWith('&')) {
        finalUrl = finalUrl.slice(0, -1);
      }

      resolve({ utmUrl: finalUrl });
  });
};
