// Core Project Types
export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  currentStep: number;
  offer: OfferData | null;
  avatar: AvatarData | null;
  competitors: CompetitorData | null;
  manifold: ManifoldData | null;
  launchDoc: LaunchDocData | null;
}

// Offer Builder Types
export interface OfferData {
  targetMarket: string;
  pressingProblem: string;
  desiredOutcome: string;
  productDescription: string;
  productPromise: string;
  proofElements: string;
  pricing: string;
  guarantee: string;
  analysis: OfferAnalysis | null;
}

export interface OfferAnalysis {
  essentialComponents: {
    massivePain: number;
    purchasingPower: number;
    easyToTarget: number;
    growingMarket: number;
    average: number;
  };
  irresistibleEquation: {
    promiseSize: number;
    perceivedLikelihood: number;
    timeDelay: number;
    effortRequired: number;
    score: number;
  };
  recommendations: OfferRecommendation[];
  projectedImprovement: {
    beforeScore: number;
    afterScore: number;
    improvement: number;
    improvementPercent: number;
    totalBudget: string;
    timeline: string;
  };
  suggestedAvatar?: {
    demographics: Demographics;
    primaryWants: string[];
    primaryEmotions: string[];
    primaryBeliefs: string[];
    dominantEmotion: string;
    primaryCurrency: string;
    millionDollarMessage: string;
  };
}

export interface OfferRecommendation {
  id: number;
  title: string;
  description: string;
  reasoning: string;
  componentImproved: string;
  scoreImpact: {
    before: number;
    after: number;
    change: number;
  };
  implementation: {
    timeRequired: string;
    budgetRequired: string;
  };
}

// Avatar Builder Types
export interface AvatarData {
  demographics: Demographics;
  webAnalysis: WEBAnalysis;
  empathyMap: EmpathyMap;
  goalsGrid: GoalsGrid;
  primaryCurrency: string;
  millionDollarMessage: string;
}

export interface Demographics {
  age: string;
  gender: string;
  location: string;
  income: string;
  education: string;
  occupation: string;
}

export interface WEBAnalysis {
  wants: string[];
  emotions: string[];
  beliefs: string[];
  dominantEmotion: string;
}

export interface EmpathyMap {
  seeing: string[];
  hearing: string[];
  saying: string[];
  thinking: string[];
  feeling: string[];
  doing: string[];
}

export interface GoalsGrid {
  painsAndFrustrations: string[];
  fearsAndImplications: string[];
  goalsAndDesires: string[];
  dreamsAndAspirations: string[];
}

// Competitor Intelligence Types
export interface CompetitorData {
  industry: string;
  competitors: Competitor[];
  marketIntelligence: MarketIntelligence;
  positioningAngles: string[];
  mvpFeatures: string[];
  distributionStrategy: string;
}

export interface Competitor {
  name: string;
  url: string;
  revenueModel: string;
  pricing: string;
  strengths: string[];
  weaknesses: string[];
  funnelArchitecture: string;
}

export interface MarketIntelligence {
  marketSize: string;
  growthTrends: string[];
  opportunities: string[];
  threats: string[];
}

// AI Avatar Manifold Types
export interface ManifoldData {
  buildABuyer: string;
  painMatrix: string;
  coreWound: string;
  benefitMatrix: string;
  desireDaisyChain: string;
  resonanceHierarchy: string;
  rhConstraints: string;
  dissolution: string;
  epiphanyThreshold: string;
  hooks: string;
  storyPrompts: string;
  languagePatterns: string;
  concentricCircles: string;
  ejectionTriggers: string;
}

// Launch Document Types
export interface LaunchDocData {
  sections: LaunchDocSection[];
  generatedAt: string;
}

export interface LaunchDocSection {
  id: number;
  title: string;
  content: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AnalysisProgress {
  step: string;
  progress: number;
  message: string;
}

