// Main service
export { personalityService as default, default as personalityService } from './service';

// Types
export type {
  AnalyzePersonalityParams, FetchSurveyParams, PersonalityResult, PersonalityTrait, SurveyQuestion,
  SurveyResponse
} from './types';

// Data
export { BIRD_SURVEY, CAT_SURVEY, DOG_SURVEY, SURVEYS } from './data/surveys';
