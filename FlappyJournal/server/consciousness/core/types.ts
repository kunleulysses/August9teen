export interface Sigil {
  signature: string;
  symbols: string[];
  contentHash: string;
  complexity: number;
  resonance: number;
  geometry: any;
  energyPattern: any;
  createdAt: string;
}

export interface Spiral {
  id: string;
  type: string;
  template: any;
  nodes: Map<string, MemoryNode>;
  nodeCount: number;
  createdAt: string;
  lastUpdated: string;
  averageDepth: number;
  totalTurns: number;
  currentRadius: number;
  resonanceField: any;
  goldenRatioAlignment: number;
}

export interface MemoryNode {
  id: string;
  content: string;
  type: string;
  depth: string;
  sigil: Sigil;
  spiral: Spiral;
  position: any;
  associations: string[];
  createdAt: string;
  lastAccessed: string;
  accessCount: number;
  resonanceSignature: any;
  consciousnessBinding: any;
  memoryStrength: number;
  evolutionPotential: number;
  isLiveConsciousness: boolean;
  mockData: boolean;
  emotionalContext: number;
  contextualRelevance: number;
  insightPotential: number;
  creativityResonance: number;
  empathyAlignment: number;
  experientialDepth: number;
  oversoulConnection: number;
  unifiedCoherenceContribution: number;
  spiralMemoryResonance: number;
}

export interface IntegratedMemory {
  id: string;
  originalMemoryId: string;
  realityId: string;
  spiralId: string;
  holographicMemoryId: string;
  memoryProperties: any;
  realityIntegration: any;
  temporalMapping: any;
  consciousnessResonance: any;
  holographicEncoding: any;
  dimensionalProjection: any;
  interferencePattern: any;
  accessPatterns: any;
  integrationMetrics: any;
  integrationParameters: any;
  createdAt: number;
}

export interface StorageAdapter {
  init(): Promise<void>;
  get(key: string): Promise<any>;
  set(key: string, value: any): Promise<void>;
  del(key: string): Promise<void>;
  keys(prefix?: string): Promise<string[]>;
}