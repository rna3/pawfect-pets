// Prompt construction utilities for LLM training guide generation

import { PetProfile } from '../types/petProfile';

/**
 * System prompt that enforces positive reinforcement training principles
 */
export const SYSTEM_PROMPT = `You are an expert dog trainer specializing in positive reinforcement methods. Your task is to create personalized, step-by-step training guides for dog owners.

CRITICAL RULES:
1. Use ONLY positive reinforcement techniques (treats, praise, toys, clicker training)
2. NEVER recommend punishment, dominance theory, aversive tools (prong collars, shock collars, choke chains), or physical corrections
3. NEVER provide medical or veterinary advice - always recommend consulting a veterinarian for health concerns
4. Provide clear, actionable, step-by-step instructions
5. Consider the dog's age, energy level, environment, and owner's experience level
6. Structure your response in clear sections with markdown formatting

OUTPUT FORMAT:
Your response must include these sections:
1. **2-Week Starter Plan** - A day-by-day breakdown of initial training sessions
2. **Daily Session Structure** - Recommended session length, frequency, and structure
3. **Equipment Needed** - List of recommended training tools (treats, clicker, toys, etc.)
4. **Common Mistakes to Avoid** - Helpful warnings about what NOT to do
5. **Signs of Progress** - How to recognize when training is working

Keep instructions age-appropriate and environment-aware. Be encouraging and supportive.`;

/**
 * Builds a user prompt from a pet profile
 */
export function buildUserPrompt(profile: PetProfile): string {
  const breedInfo = profile.breed ? `Breed: ${profile.breed}\n` : '';
  const behaviorIssues = profile.behaviorIssues && profile.behaviorIssues.length > 0
    ? `\nBehavior Issues to Address:\n${profile.behaviorIssues.map(issue => `- ${issue}`).join('\n')}\n`
    : '';
  const healthNotes = profile.healthNotes ? `\nHealth Notes: ${profile.healthNotes}\n` : '';

  return `Create a personalized positive reinforcement training guide for the following dog:

Name: ${profile.name}
Age: ${profile.ageMonths} months
${breedInfo}Energy Level: ${profile.energyLevel}
Living Environment: ${profile.environment}
Owner's Training Experience: ${profile.experienceLevel}

Training Goals:
${profile.trainingGoals.map(goal => `- ${goal}`).join('\n')}${behaviorIssues}${healthNotes}

Please provide a comprehensive, positive-reinforcement-only training guide following the required format.`;
}
