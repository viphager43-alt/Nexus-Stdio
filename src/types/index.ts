export type UserTier = 'free' | 'vip';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  credits: number;
  isVip: boolean;
  vipExpiresAt?: string | null;
  totalPrompts: number;
  lastActive: string;
  createdAt: string;
  status: 'active' | 'suspended';
  notes?: string;
}

export interface PromoCode {
  id: string;
  code: string;
  type: 'vip_lifetime' | 'vip_30days' | 'credits';
  creditsAmount: number;
  maxUses: number;
  usedCount: number;
  usedBy: string[];
  createdAt: string;
  expiresAt?: string | null;
  active: boolean;
}

export interface FileArtifact {
  fileName: string;
  fileType: 'html' | 'javascript' | 'python' | 'dart' | 'json' | 'css' | 'other';
  category: 'website' | 'bot' | 'app' | 'script';
  title: string;
  code: string;
  runnable: boolean;
  instructions?: string;
  buildRoadmap?: {
    techStack: string[];
    prerequisites: string[];
    steps: string[];
    buildCommands: string[];
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: string;
  modelUsed?: string;
  artifacts?: FileArtifact[];
  isVipGeneration?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  systemInstruction: string;
  model: string;
  temperature: number;
  topP: number;
  topK: number;
  isPinned?: boolean;
  category?: 'chat' | 'website' | 'bot' | 'app';
}

export interface ModelOption {
  id: string;
  name: string;
  badge: string;
  description: string;
  requiresVip: boolean;
  speed: string;
  contextWindow: string;
}

export interface AppSettings {
  globalAnnouncement: string;
  announcementActive: boolean;
  defaultCredits: number;
  unlimitedFreeAccess: boolean;
  systemName: string;
}

export interface AdminStats {
  totalUsers: number;
  totalVipUsers: number;
  totalCreditsDistributed: number;
  totalPromptsHandled: number;
  activePromoCodes: number;
}
