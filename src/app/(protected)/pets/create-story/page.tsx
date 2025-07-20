"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Survey questions (from survey.json)
const SURVEY_QUESTIONS = [
  {
    questionId: "energy_1",
    question: "How active is your dog during the day?",
    category: "energy",
    options: [
      "Very active - always moving",
      "Moderately active",
      "Somewhat lazy",
      "Very lazy - sleeps most of the day"
    ],
    weights: [1.0, 0.7, 0.4, 0.1],
    required: true,
    description: "This helps determine your dog's energy level and exercise needs"
  },
  {
    questionId: "social_1",
    question: "How does your dog interact with other animals?",
    category: "social",
    options: [
      "Very friendly and playful",
      "Generally friendly",
      "Neutral or indifferent",
      "Aggressive or fearful"
    ],
    weights: [1.0, 0.7, 0.4, 0.1],
    required: true,
    description: "This helps understand social behavior and training needs"
  },
  {
    questionId: "intelligence_1",
    question: "How quickly does your dog learn new commands?",
    category: "intelligence",
    options: [
      "Learns very quickly (1-3 attempts)",
      "Learns quickly (4-7 attempts)",
      "Takes time to learn (8-15 attempts)",
      "Very difficult to train"
    ],
    weights: [1.0, 0.7, 0.4, 0.1],
    required: true,
    description: "This indicates intelligence and trainability"
  }
];

// Breed options
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

interface FormData {
  name: string;
  type: 'dog' | 'cat' | 'bird' | '';
  breed: string;
  responses: Array<{
    questionId: string;
    selectedIndex: number;
    answer: string;
  }>;
}

interface PersonalityResult {
  petId: string;
  personalityId: string;
  traits: Array<{
    traitId: string;
    name: string;
    value: number;
    category: string;
    confidence: number;
    description: string;
  }>;
  confidence: number;
  sessionId: string;
  message: string;
}

export default function CreateStoryPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    type: '',
    breed: '',
    responses: []
  });
  const [personalityResult, setPersonalityResult] = useState<PersonalityResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('pawmery-create-story');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed.formData || formData);
        setCurrentStep(parsed.currentStep || 1);
      } catch (e) {
        console.log('Failed to load saved data');
      }
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('pawmery-create-story', JSON.stringify({
      formData,
      currentStep
    }));
  }, [formData, currentStep]);

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const submitToServer = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call - replace with actual endpoint
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response based on sample-response.json
      const mockResult: PersonalityResult = {
        petId: "pet_" + Date.now(),
        personalityId: "personality_" + Math.random().toString(36).substr(2, 9),
        traits: [
          {
            traitId: "trait_1",
            name: "Velcro Companion",
            value: 1,
            category: "loyalty",
            confidence: 1,
            description: `${formData.name} forms intense attachments and acts like a shadow, following favorite humans everywhere with unwavering devotion.`
          },
          {
            traitId: "trait_2",
            name: "Play Instigator",
            value: 1,
            category: "playfulness",
            confidence: 1,
            description: `This ${formData.type} turns everything into a game - bringing toys unprompted and inventing creative ways to engage others.`
          },
          {
            traitId: "trait_3",
            name: "Social Butterfly",
            value: 0.85,
            category: "social",
            confidence: 0.9,
            description: `${formData.name} greets most beings with enthusiastic energy, though shows slight discretion with strangers.`
          }
        ],
        confidence: 0.95,
        sessionId: "session_" + Math.random().toString(36).substr(2, 9),
        message: "Personality analysis completed successfully"
      };
      
      setPersonalityResult(mockResult);
      nextStep();
    } catch (error) {
      console.error('Failed to submit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmCreation = () => {
    // Clear localStorage
    localStorage.removeItem('pawmery-create-story');
    // Redirect to pets page
    router.push('/pets');
  };

  const restartSurvey = () => {
    setCurrentStep(3); // Go back to survey step
    setPersonalityResult(null);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.name.trim() && formData.type;
      case 2: return formData.breed;
      case 3: return formData.responses.length === SURVEY_QUESTIONS.length;
      default: return true;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-semibold text-gray-900">Start Your Pet's Story</h1>
            <span className="text-sm text-gray-500">Step {currentStep} of 4</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {currentStep === 1 && (
          <PetInfoStep 
            formData={formData} 
            updateFormData={updateFormData}
          />
        )}
        
        {currentStep === 2 && (
          <BreedSelectionStep 
            formData={formData} 
            updateFormData={updateFormData}
          />
        )}
        
        {currentStep === 3 && (
          <SurveyStep 
            formData={formData} 
            updateFormData={updateFormData}
          />
        )}
        
        {currentStep === 4 && personalityResult && (
          <ResultsStep 
            formData={formData}
            personalityResult={personalityResult}
            onConfirm={confirmCreation}
            onRestart={restartSurvey}
          />
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {currentStep < 3 && (
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          )}
          
          {currentStep === 3 && (
            <button
              onClick={submitToServer}
              disabled={!canProceed() || isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Analyzing...' : 'Create Story'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Step 1: Pet Info
function PetInfoStep({ formData, updateFormData }: { 
  formData: FormData; 
  updateFormData: (updates: Partial<FormData>) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about your pet</h2>
        <p className="text-gray-600">Let's start with the basics</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Pet Name */}
        <div>
          <label htmlFor="petName" className="block text-sm font-medium text-gray-700 mb-2">
            What's your pet's name?
          </label>
          <input
            type="text"
            id="petName"
            value={formData.name}
            onChange={(e) => updateFormData({ name: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your pet's name"
          />
        </div>

        {/* Pet Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            What type of pet do you have?
          </label>
          <div className="grid grid-cols-3 gap-4">
            {(['dog', 'cat', 'bird'] as const).map((type) => (
              <button
                key={type}
                onClick={() => updateFormData({ type, breed: '' })}
                className={`p-4 border-2 rounded-lg text-center transition-colors ${
                  formData.type === type
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-3xl mb-2">
                  {type === 'dog' ? '🐕' : type === 'cat' ? '🐱' : '🐦'}
                </div>
                <div className="font-medium capitalize">{type}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 2: Breed Selection
function BreedSelectionStep({ formData, updateFormData }: { 
  formData: FormData; 
  updateFormData: (updates: Partial<FormData>) => void;
}) {
  const breeds = BREEDS[formData.type as keyof typeof BREEDS] || [];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">What breed is {formData.name}?</h2>
        <p className="text-gray-600">Choose the breed that best matches your {formData.type}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {breeds.map((breed) => (
            <button
              key={breed}
              onClick={() => updateFormData({ breed })}
              className={`p-3 border-2 rounded-lg text-sm transition-colors ${
                formData.breed === breed
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {breed}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Step 3: Survey
function SurveyStep({ formData, updateFormData }: { 
  formData: FormData; 
  updateFormData: (updates: Partial<FormData>) => void;
}) {
  const handleAnswerSelect = (questionId: string, selectedIndex: number, answer: string) => {
    const updatedResponses = formData.responses.filter(r => r.questionId !== questionId);
    updatedResponses.push({ questionId, selectedIndex, answer });
    updateFormData({ responses: updatedResponses });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about {formData.name}'s personality</h2>
        <p className="text-gray-600">These questions help us understand their unique character</p>
      </div>

      <div className="space-y-6">
        {SURVEY_QUESTIONS.map((question, index) => {
          const response = formData.responses.find(r => r.questionId === question.questionId);
          
          return (
            <div key={question.questionId} className="bg-white rounded-lg shadow p-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {index + 1}. {question.question}
                </h3>
                <p className="text-sm text-gray-600">{question.description}</p>
              </div>
              
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => (
                  <button
                    key={optionIndex}
                    onClick={() => handleAnswerSelect(question.questionId, optionIndex, option)}
                    className={`w-full text-left p-3 border rounded-lg transition-colors ${
                      response?.selectedIndex === optionIndex
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Step 4: Results
function ResultsStep({ 
  formData, 
  personalityResult, 
  onConfirm, 
  onRestart 
}: { 
  formData: FormData; 
  personalityResult: PersonalityResult;
  onConfirm: () => void;
  onRestart: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Meet {formData.name}!</h2>
        <p className="text-gray-600">Here's what we learned about their personality</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
          <div className="text-2xl">✨</div>
          <div>
            <h3 className="font-semibold text-green-800">Analysis Complete</h3>
            <p className="text-sm text-green-600">Confidence: {Math.round(personalityResult.confidence * 100)}%</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Personality Traits</h3>
          {personalityResult.traits.map((trait) => (
            <div key={trait.traitId} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900">{trait.name}</h4>
                <span className="text-sm text-gray-500">{Math.round(trait.value * 100)}%</span>
              </div>
              <p className="text-gray-600 text-sm">{trait.description}</p>
            </div>
          ))}
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Does this sound like {formData.name}?</h3>
          <div className="flex space-x-4">
            <button
              onClick={onConfirm}
              className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700"
            >
              Yes, this is perfect! ✨
            </button>
            <button
              onClick={onRestart}
              className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700"
            >
              Let me adjust the answers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 