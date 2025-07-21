import { personalityService } from './service';
import { AnalyzePersonalityParams, SurveyResponse, OwnerInfo, JobStatusResponse } from './types';

/**
 * Example of how to use the refactored personality service with async job processing
 */
export async function exampleUsage() {
  // Define owner information
  const ownerInfo: OwnerInfo = {
    ownerId: "owner_67890",
    ownerName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1-555-0123"
  };

  // Define survey responses (these would come from user input)
  const responses: SurveyResponse[] = [
    {
      questionId: "energy_1",
      selectedIndex: 0, // "Very active - always moving"
      answer: "Very active - always moving"
    },
    {
      questionId: "social_1",
      selectedIndex: 0, // "Very friendly and playful"
      answer: "Very friendly and playful"
    },
    {
      questionId: "intelligence_1",
      selectedIndex: 0, // "Learns very quickly (1-3 attempts)"
      answer: "Learns very quickly (1-3 attempts)"
    },
    {
      questionId: "independence_1",
      selectedIndex: 3, // "Very dependent - always wants to be with humans"
      answer: "Very dependent - always wants to be with humans"
    },
    {
      questionId: "playfulness_1",
      selectedIndex: 0, // "Extremely playful - always ready to play"
      answer: "Extremely playful - always ready to play"
    }
  ];

  // Define analysis parameters
  const analysisParams: AnalyzePersonalityParams = {
    petName: "Buddy",
    kind: "dog",
    breed: "Golden Retriever",
    responses,
    ownerInfo,
    metadata: {
      age: 3,
      weight: 65,
      gender: "male",
      neutered: true,
      location: "San Francisco, CA"
    }
  };

  try {
    console.log('=== STEP 1: Submit Analysis Job ===');
    
    // Submit the job and get jobId immediately
    const jobCreation = await personalityService.analyzePersonality(analysisParams);
    console.log('Job submitted successfully:', jobCreation);
    console.log(`Job ID: ${jobCreation.jobId}`);
    console.log(`Estimated wait time: ${jobCreation.estimatedWaitTime}`);
    
    // At this point, user could navigate away and come back later with the jobId
    
    console.log('\n=== STEP 2: Check Job Status (One-time) ===');
    
    // Check status once (useful for UI updates)
    const currentStatus = await personalityService.getJobStatus(jobCreation.jobId);
    console.log('Current job status:', currentStatus);
    
    console.log('\n=== STEP 3: Poll for Completion ===');
    
    // Poll until completion with status updates
    const finalResult = await personalityService.pollForCompletion(
      jobCreation.jobId,
      (status: JobStatusResponse) => {
        // This callback would be used to update UI
        console.log(`🔄 Status Update: ${status.status} - ${status.message || 'Processing...'}`);
        if (status.progress) {
          console.log(`   📊 Progress: ${status.progress}%`);
        }
        if (status.createdAt) {
          console.log(`   📅 Created: ${new Date(status.createdAt).toLocaleString()}`);
        }
        if (status.error) {
          console.log(`   ❌ Error: ${status.error}`);
        }
      }
    );
    
    console.log('\n=== STEP 4: Results Ready! ===');
    console.log('✅ Analysis completed successfully!');
    console.log('Final result:', finalResult);
    console.log('Summary:', finalResult.summary);
    console.log('Generated traits:', finalResult.traits.map(t => t.name).join(', '));
    console.log('Processing time:', finalResult.processingTime, 'ms');
    
    return finalResult;
    
  } catch (error) {
    console.error('❌ Error during personality analysis:', error);
    throw error;
  }
}

/**
 * Example of checking an existing job (useful when user returns to app)
 */
export async function exampleCheckExistingJob(jobId: string) {
  try {
    console.log(`=== Checking existing job: ${jobId} ===`);
    
    // Check current status
    const status = await personalityService.getJobStatus(jobId);
    console.log('Job status:', status);
    
    if (status.status === 'success') {
      console.log('✅ Job already completed!');
      // Job is done, we can use the result
      if (status.result) {
        console.log('Result summary:', status.summary);
        return status.result;
      }
    } else if (status.status === 'failed') {
      console.log('❌ Job failed:', status.error);
      throw new Error(`Job failed: ${status.error}`);
    } else {
      console.log(`🔄 Job still ${status.status}, starting polling...`);
      // Job still processing, start polling
      return await personalityService.pollForCompletion(jobId, (updateStatus) => {
        console.log(`Status: ${updateStatus.status}`);
      });
    }
    
  } catch (error) {
    console.error('Error checking existing job:', error);
    throw error;
  }
}

/**
 * Example of the typical UI workflow
 */
export async function exampleUIWorkflow() {
  console.log('=== Typical UI Workflow Example ===');
  
  // This represents what happens on the survey submission page
  console.log('📝 User submits survey...');
  
  // Submit job (fast operation)
  const analysisParams = {
    /* ... same as above ... */
  } as AnalyzePersonalityParams;
  
  const jobCreation = await personalityService.analyzePersonality(analysisParams);
  
  // Navigate to results page with jobId
  console.log(`🔄 Navigating to results page with jobId: ${jobCreation.jobId}`);
  
  // This represents what happens on the results page
  console.log('📊 Results page polling for completion...');
  
  const result = await personalityService.pollForCompletion(
    jobCreation.jobId,
    (status) => {
      // Update UI with current status
      console.log(`UI Update: ${status.status}`);
    }
  );
  
  console.log('🎉 Show results to user:', result.summary);
  
  return result;
}

// Export for testing or usage in other parts of the app
export { exampleUsage as default }; 