// PetProfile type definitions for training guide generation

export type EnergyLevel = 'low' | 'medium' | 'high';
export type Environment = 'apartment' | 'house' | 'rural';
export type ExperienceLevel = 'none' | 'basic' | 'intermediate';

export interface PetProfile {
  name: string;
  ageMonths: number;
  breed?: string;
  energyLevel: EnergyLevel;
  environment: Environment;
  experienceLevel: ExperienceLevel;
  trainingGoals: string[];
  behaviorIssues?: string[];
  healthNotes?: string;
}
