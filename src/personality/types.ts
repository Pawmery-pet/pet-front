export interface SurveyQuestion {
  questionId: string;
  question: string;
  category: string;
  options: string[];
  weights: number[];
  required: boolean;
  description: string;
}

export interface SurveyResponse {
  questionId: string;
  selectedIndex: number;
  answer: string;
}

export interface PersonalityTrait {
  traitId: string;
  name: string;
  value: number;
  category: string;
  confidence: number;
  description: string;
}

export interface PersonalityResult {
  petId: string;
  personalityId: string;
  traits: PersonalityTrait[];
  confidence: number;
  sessionId: string;
  message: string;
}

export interface FetchSurveyParams {
  kind: 'dog' | 'cat' | 'bird';
  breed: string;
}

export interface AnalyzePersonalityParams {
  petName: string;
  kind: 'dog' | 'cat' | 'bird';
  breed: string;
  responses: SurveyResponse[];
} 