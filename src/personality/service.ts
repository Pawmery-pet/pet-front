import { SURVEYS } from './data/surveys';
import {
  AnalyzePersonalityParams,
  FetchSurveyParams,
  PersonalityResult,
  SurveyQuestion
} from './types';

class PersonalityService {
  /**
   * Fetch survey questions based on pet type and breed
   */
  async fetchSurvey(params: FetchSurveyParams): Promise<SurveyQuestion[]> {
    const { kind, breed } = params;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // For now, return questions based on pet type
    // In the future, this could be enhanced to return different questions based on breed
    const surveyQuestions = SURVEYS[kind];

    if (!surveyQuestions) {
      throw new Error(`No survey available for pet type: ${kind}`);
    }

    // Clone to avoid mutations
    return JSON.parse(JSON.stringify(surveyQuestions));
  }

  /**
   * Analyze personality based on survey responses
   */
  async analyzePersonality(params: AnalyzePersonalityParams): Promise<PersonalityResult> {
    const { petName, kind, breed, responses } = params;

    // Simulate API call to personality analysis service
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock personality analysis - in production this would call a real AI service
    const mockResult: PersonalityResult = {
      petId: "pet_" + Date.now(),
      personalityId: "personality_" + Math.random().toString(36).substr(2, 9),
      traits: this.generateTraits(petName, kind, responses),
      confidence: this.calculateConfidence(responses),
      sessionId: "session_" + Math.random().toString(36).substr(2, 9),
      message: "Personality analysis completed successfully"
    };

    return mockResult;
  }

  /**
   * Generate personality traits based on responses
   */
  private generateTraits(petName: string, kind: string, responses: any[]) {
    // This is mock logic - in production, this would be more sophisticated
    const traits = [
      {
        traitId: "trait_1",
        name: "Velcro Companion",
        value: 1,
        category: "loyalty",
        confidence: 1,
        description: `${petName} forms intense attachments and acts like a shadow, following favorite humans everywhere with unwavering devotion.`
      },
      {
        traitId: "trait_2",
        name: "Play Instigator",
        value: 1,
        category: "playfulness",
        confidence: 1,
        description: `This ${kind} turns everything into a game - bringing toys unprompted and inventing creative ways to engage others.`
      },
      {
        traitId: "trait_3",
        name: "Social Butterfly",
        value: 0.85,
        category: "social",
        confidence: 0.9,
        description: `${petName} greets most beings with enthusiastic energy, though shows slight discretion with strangers.`
      }
    ];

    // Adjust traits based on responses
    if (responses.length > 0) {
      // Example: If first response indicates high energy, boost energy-related traits
      const firstResponse = responses[0];
      if (firstResponse && firstResponse.selectedIndex <= 1) {
        traits.push({
          traitId: "trait_4",
          name: "Energy Dynamo",
          value: 0.9,
          category: "energy",
          confidence: 0.85,
          description: `${petName} has boundless energy and loves to stay active throughout the day.`
        });
      }
    }

    return traits;
  }

  /**
   * Calculate overall confidence based on responses
   */
  private calculateConfidence(responses: any[]): number {
    // Simple confidence calculation - in production this would be more complex
    const baseConfidence = 0.8;
    const responseBonus = Math.min(responses.length * 0.03, 0.15);
    return Math.min(baseConfidence + responseBonus, 0.98);
  }

  /**
   * Get available pet breeds for a given type
   */
  getBreeds(kind: 'dog' | 'cat' | 'bird'): string[] {
    const BREEDS = {
      dog: [
        "Golden Retriever", "Labrador", "German Shepherd", "Bulldog",
        "Poodle", "Beagle", "Rottweiler", "Yorkshire Terrier"
      ],
      cat: [
        "Persian", "Maine Coon", "British Shorthair", "Ragdoll",
        "Siamese", "American Shorthair", "Scottish Fold", "Sphynx"
      ],
      bird: [
        "Budgerigar", "Cockatiel", "Canary", "Lovebird",
        "Conure", "African Grey", "Cockatoo", "Finch"
      ]
    };

    return BREEDS[kind] || [];
  }
}

// Export singleton instance
export const personalityService = new PersonalityService();
export default personalityService; 