import axios from 'axios';
import type { OfferData, OfferAnalysis, AvatarData, CompetitorData, ManifoldData, LaunchDocData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Offer Analysis
export async function analyzeOffer(offerData: OfferData): Promise<OfferAnalysis> {
  const response = await api.post('/analyze/offer', offerData);
  return response.data.data;
}

// Avatar Analysis
export async function analyzeAvatar(avatarData: AvatarData): Promise<Partial<AvatarData>> {
  const response = await api.post('/analyze/avatar', avatarData);
  return response.data.data;
}

// Competitor Analysis
export async function analyzeCompetitors(data: { industry: string; competitorUrls: string[] }): Promise<CompetitorData> {
  const response = await api.post('/analyze/competitors', data);
  return response.data.data;
}

// Manifold Workflow
export async function runManifoldWorkflow(data: {
  offer: OfferData;
  avatar: AvatarData;
  competitors: CompetitorData | null;
}): Promise<ManifoldData> {
  const response = await api.post('/analyze/manifold', data);
  return response.data.data;
}

// Launch Document Generation
export async function generateLaunchDocument(data: {
  offer: OfferData;
  avatar: AvatarData;
  competitors: CompetitorData | null;
  manifold: ManifoldData;
}): Promise<LaunchDocData> {
  const response = await api.post('/generate/launch-document', data);
  return response.data.data;
}

// Export Document
export async function exportDocument(projectId: string, format: 'pdf' | 'docx' | 'md'): Promise<Blob> {
  const response = await api.post(`/export/${format}`, { projectId }, {
    responseType: 'blob',
  });
  return response.data;
}

// Query Interface
export async function queryLaunchDoc(projectId: string, question: string): Promise<string> {
  const response = await api.post('/query', { projectId, question });
  return response.data.data.answer;
}

export default api;

