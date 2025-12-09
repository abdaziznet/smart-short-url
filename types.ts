export interface ShortLink {
  id: string;
  originalUrl: string;
  shortCode: string;
  createdAt: number;
  visits: number;
  title?: string;
  summary?: string;
  tags?: string[];
  lastVisited?: number;
}

export interface AIAnalysisResult {
  title: string;
  summary: string;
  tags: string[];
  suggestedAlias: string;
  safetyScore: number; // 1-100
}

export type ViewMode = 'dashboard' | 'redirect';
