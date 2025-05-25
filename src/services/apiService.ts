//mock API service for lnktk.it

import { ShortLink, AnalyticsData, ShortenApiRequest, ShortenApiResponse, QRCodeApiRequest, QRCodeApiResponse, UTMParams } from '../../types';

const MOCK_API_DELAY = 500; // ms

let mockLinks: ShortLink[] = [
  { 
    id: 'abc123', 
    originalUrl: 'https://example.com/very/long/url/to/be/shortened/for-demonstration-purposes', 
    shortUrl: 'https://lnktk.it/abc123', 
    clicks: 153, 
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    expiry: new Date(Date.now() + 86400000 * 30).toISOString(), // 30 days from now
  },
  { 
    id: 'xyz456', 
    originalUrl: 'https://another-example.com/another/long/path/which/is/quite/extensive', 
    shortUrl: 'https://lnktk.it/xyz456', 
    clicks: 287, 
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    expiry: new Date(Date.now() + 86400000 * 60).toISOString(),
  },
  { 
    id: 'def789', 
    originalUrl: 'https://google.com', 
    shortUrl: 'https://lnktk.it/gsearch', 
    clicks: 1024, 
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
  },
];

export const shortenUrl = async (data: ShortenApiRequest): Promise<ShortenApiResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newId = data.alias || Math.random().toString(36).substring(2, 8);
      // Check for alias collision (simple check)
      if (mockLinks.find(link => link.shortUrl.endsWith(`/${newId}`))) {
        // In a real app, handle collision error properly
        console.warn(`Alias ${newId} already exists. Generating random.`);
        // For mock, let's just ignore alias if it collides to simplify
      }
      const newShortUrl = `https://lnktk.it/${newId}`;
      const createdAt = new Date().toISOString();
      const expiry = new Date(Date.now() + 86400000 * 30).toISOString(); // Default 30 days expiry

      const newLinkEntry: ShortLink = {
        id: newId,
        originalUrl: data.url,
        shortUrl: newShortUrl,
        clicks: 0,
        createdAt,
        expiry,
      };
      mockLinks = [newLinkEntry, ...mockLinks]; // Add to top
      resolve({ id: newId, shortUrl: newShortUrl, originalUrl: data.url, createdAt, expiry });
    }, MOCK_API_DELAY);
  });
};

export const getShortLinks = async (): Promise<ShortLink[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockLinks]); // Return a copy
    }, MOCK_API_DELAY);
  });
};

export const deleteShortLink = async (id: string): Promise<{ success: boolean }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const initialLength = mockLinks.length;
      mockLinks = mockLinks.filter(link => link.id !== id);
      resolve({ success: mockLinks.length < initialLength });
    }, MOCK_API_DELAY);
  });
}

export const getAnalyticsForLink = async (linkId: string): Promise<AnalyticsData | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const link = mockLinks.find(l => l.id === linkId || l.shortUrl.endsWith(`/${linkId}`));
      if (!link) {
        resolve(null);
        return;
      }
      // Simulate some analytics data
      const totalClicks = link.clicks + Math.floor(Math.random() * 10); // Increment clicks for demo
      const analytics: AnalyticsData = {
        linkId: link.id,
        originalUrl: link.originalUrl,
        shortUrl: link.shortUrl,
        totalClicks: totalClicks,
        referrers: [
          { source: 'google.com', count: Math.floor(totalClicks * 0.4) },
          { source: 'twitter.com', count: Math.floor(totalClicks * 0.2) },
          { source: 'direct', count: Math.floor(totalClicks * 0.3) },
          { source: 'other.com', count: Math.floor(totalClicks * 0.1) },
        ],
        devices: [
          { type: 'Desktop', count: Math.floor(totalClicks * 0.6) },
          { type: 'Mobile', count: Math.floor(totalClicks * 0.35) },
          { type: 'Tablet', count: Math.floor(totalClicks * 0.05) },
        ],
        locations: [
          { country: 'USA', count: Math.floor(totalClicks * 0.5) },
          { country: 'Canada', count: Math.floor(totalClicks * 0.15) },
          { country: 'UK', count: Math.floor(totalClicks * 0.1) },
          { country: 'Germany', count: Math.floor(totalClicks * 0.1) },
          { country: 'Other', count: Math.floor(totalClicks * 0.15) },
        ],
        clickTrend: Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          return {
            date: date.toISOString().split('T')[0],
            clicks: Math.floor(totalClicks / 7) + Math.floor(Math.random() * (totalClicks/10) - (totalClicks/20)),
          };
        }),
      };
      // Update mock link clicks
      const linkIndex = mockLinks.findIndex(l => l.id === link.id);
      if(linkIndex > -1) mockLinks[linkIndex].clicks = totalClicks;

      resolve(analytics);
    }, MOCK_API_DELAY);
  });
};

export const generateQRCode = async (data: QRCodeApiRequest): Promise<QRCodeApiResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Use a public QR code generation service for the mock
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(data.url)}&size=250x250&format=png&bgcolor=1e293b&color=94a3b8&qzone=1`;
      resolve({ qrCodeUrl });
    }, MOCK_API_DELAY);
  });
};

export const buildUtmUrl = async (params: UTMParams): Promise<{ utmUrl: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
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
    }, MOCK_API_DELAY / 2); // Faster for UTM building
  });
};
