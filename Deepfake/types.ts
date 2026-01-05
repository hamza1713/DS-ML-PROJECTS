
export enum ContentType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  TEXT = 'TEXT',
  AUDIO = 'AUDIO'
}

export interface DetectionResult {
  isAI: boolean;
  confidence: number;
  reasons: string[];
  artifacts: string[];
  summary: string;
}

export interface AnalysisState {
  isAnalyzing: boolean;
  result: DetectionResult | null;
  error: string | null;
  previewUrl: string | null;
  textContent: string;
}
