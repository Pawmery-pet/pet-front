"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { personalityService, PersonalityResult, JobStatusResponse, JobStatus } from '@/personality';

interface PendingPet {
  jobId: string;
  petName: string;
  petType: string;
  breed: string;
  status: string;
  createdAt: string;
  estimatedWaitTime?: string;
}

export default function PetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const petId = params.petId as string;
  
  const [pendingPet, setPendingPet] = useState<PendingPet | null>(null);
  const [jobStatus, setJobStatus] = useState<JobStatusResponse | null>(null);
  const [personalityResult, setPersonalityResult] = useState<PersonalityResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    // Check if this is a pending pet
    const stored = localStorage.getItem('pawmery-pending-pets');
    if (stored) {
      try {
        const pets: PendingPet[] = JSON.parse(stored);
        const pet = pets.find(p => p.jobId === petId);
        if (pet) {
          setPendingPet(pet);
          startPollingIfNeeded(pet);
        }
      } catch (error) {
        console.error('Error loading pending pet:', error);
        setError('Error loading pet information');
      }
    }
  }, [petId]);

  const startPollingIfNeeded = (pet: PendingPet) => {
    if (pet.status === 'success' || pet.status === 'failed') {
      // If already completed/failed, just get final status
      checkFinalStatus();
    } else {
      // Start real-time polling
      startPolling();
    }
  };

  const checkFinalStatus = async () => {
    try {
      const status = await personalityService.getJobStatus(petId);
      setJobStatus(status);
      
      if (status.status === 'success' && status.result) {
        setPersonalityResult(status.result);
        // Remove from pending pets since it's completed
        removePendingPet(petId);
      }
    } catch (error) {
      console.error('Error checking final status:', error);
      setError('Error loading pet results');
    }
  };

  const startPolling = async () => {
    if (isPolling) return; // Prevent multiple polling sessions
    
    setIsPolling(true);
    setError(null);
    
    try {
      const result = await personalityService.pollForCompletion(
        petId,
        (statusUpdate: JobStatusResponse) => {
          console.log('Status update:', statusUpdate);
          setJobStatus(statusUpdate);
          
          // Update pending pet status in localStorage
          updatePendingPetStatus(petId, statusUpdate.status);
        }
      );
      
      setPersonalityResult(result);
      setIsPolling(false);
      
      // Remove from pending pets since it's completed
      removePendingPet(petId);
      
    } catch (error) {
      console.error('Polling error:', error);
      setError(error instanceof Error ? error.message : 'Error during polling');
      setIsPolling(false);
    }
  };

  const updatePendingPetStatus = (jobId: string, status: JobStatus) => {
    const stored = localStorage.getItem('pawmery-pending-pets');
    if (stored) {
      try {
        const pets: PendingPet[] = JSON.parse(stored);
        const updatedPets = pets.map(pet => 
          pet.jobId === jobId ? { ...pet, status } : pet
        );
        localStorage.setItem('pawmery-pending-pets', JSON.stringify(updatedPets));
        
        // Update local state too
        setPendingPet(prev => prev ? { ...prev, status } : null);
      } catch (error) {
        console.error('Error updating pending pet status:', error);
      }
    }
  };

  const removePendingPet = (jobId: string) => {
    const stored = localStorage.getItem('pawmery-pending-pets');
    if (stored) {
      try {
        const pets: PendingPet[] = JSON.parse(stored);
        const updatedPets = pets.filter(pet => pet.jobId !== jobId);
        localStorage.setItem('pawmery-pending-pets', JSON.stringify(updatedPets));
      } catch (error) {
        console.error('Error removing pending pet:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'queued': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPetEmoji = (petType: string) => {
    switch (petType) {
      case 'dog': return '🐕';
      case 'cat': return '🐱';
      case 'bird': return '🐦';
      default: return '🐾';
    }
  };

  // Loading state
  if (!pendingPet && !error) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pet information...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 text-4xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-red-800 mb-2">Error</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <div className="space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Try Again
            </button>
            <Link
              href="/dashboard"
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="px-4 py-6 sm:px-0">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">{getPetEmoji(pendingPet?.petType || 'dog')}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{pendingPet?.petName}</h1>
              <p className="text-gray-600">{pendingPet?.breed}</p>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="text-gray-600 hover:text-gray-800 text-sm font-medium"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Status Section */}
      {jobStatus && (
        <div className={`border rounded-lg p-6 mb-6 ${getStatusColor(jobStatus.status)}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-semibold">Status: {jobStatus.status}</h3>
                {isPolling && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>}
              </div>
              {jobStatus.message && <p className="text-sm mb-2">{jobStatus.message}</p>}
              {jobStatus.status === 'failed' && jobStatus.error && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                  <strong>Error Details:</strong> {jobStatus.error}
                </div>
              )}
              {jobStatus.progress && (
                <div className="mt-2">
                  <p className="text-sm mb-1">Progress: {jobStatus.progress}%</p>
                  <div className="w-48 bg-white bg-opacity-50 rounded-full h-2">
                    <div
                      className="bg-current h-2 rounded-full transition-all duration-300"
                      style={{ width: `${jobStatus.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm">Job ID: {petId}</p>
              {jobStatus.createdAt && (
                <p className="text-xs">Created: {new Date(jobStatus.createdAt).toLocaleString()}</p>
              )}
              {jobStatus.updatedAt && (
                <p className="text-xs">Updated: {new Date(jobStatus.updatedAt).toLocaleString()}</p>
              )}
              {pendingPet && !jobStatus.createdAt && (
                <p className="text-xs">Created: {new Date(pendingPet.createdAt).toLocaleString()}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      {personalityResult ? (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">🎉 {pendingPet?.petName}'s Story is Ready!</h2>
            
            {personalityResult.summary && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Personality Summary</h3>
                <p className="text-blue-700">{personalityResult.summary}</p>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Personality Traits</h3>
              {personalityResult.traits.map((trait) => (
                <div key={trait.traitId} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{trait.name}</h4>
                    <span className="text-sm text-gray-500">
                      {Math.round(trait.value * 100)}% confidence
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{trait.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">
                    Analysis completed {personalityResult.completedAt && new Date(personalityResult.completedAt).toLocaleString()}
                  </p>
                  {personalityResult.processingTime && (
                    <p className="text-xs text-gray-400">
                      Processing time: {personalityResult.processingTime} ms
                    </p>
                  )}
                </div>
                <div className="space-x-4">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    Add Memory
                  </button>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                    Share Story
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Waiting for results */
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="mb-6">
            <div className="animate-pulse">
              <div className="text-6xl mb-4">⏳</div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Creating {pendingPet?.petName}'s Story...
            </h2>
            <p className="text-gray-600 mb-4">
              We're analyzing their personality and creating a unique story just for them.
            </p>
            
            {isPolling && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-blue-800 text-sm font-medium">
                    Checking status every 5 seconds...
                  </span>
                </div>
              </div>
            )}
          </div>
          
          <div className="text-left max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 What we're doing:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Analyzing your pet's personality responses</li>
              <li>• Creating personalized traits and insights</li>
              <li>• Generating a unique story summary</li>
              <li>• Preparing recommendations for bonding</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
} 