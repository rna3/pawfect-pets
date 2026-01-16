import express, { Response } from 'express';
import { body, validationResult } from 'express-validator';
import OpenAI from 'openai';
import { PetProfile } from '../types/petProfile';
import { SYSTEM_PROMPT, buildUserPrompt } from '../utils/prompts';

const router = express.Router();

// Initialize OpenAI client
const getOpenAIClient = (): OpenAI => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }
  return new OpenAI({ apiKey });
};

// @route   POST /api/training-guide
// @desc    Generate a personalized dog training guide using LLM
// @access  Public (can be made protected later)
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Pet name is required'),
    body('ageMonths').isInt({ min: 1, max: 240 }).withMessage('Age must be between 1 and 240 months'),
    body('breed').optional().trim(),
    body('energyLevel').isIn(['low', 'medium', 'high']).withMessage('Energy level must be low, medium, or high'),
    body('environment').isIn(['apartment', 'house', 'rural']).withMessage('Environment must be apartment, house, or rural'),
    body('experienceLevel').isIn(['none', 'basic', 'intermediate']).withMessage('Experience level must be none, basic, or intermediate'),
    body('trainingGoals').isArray({ min: 1 }).withMessage('At least one training goal is required'),
    body('trainingGoals.*').trim().notEmpty().withMessage('Training goals cannot be empty'),
    body('behaviorIssues').optional().isArray(),
    body('behaviorIssues.*').trim().notEmpty().withMessage('Behavior issues cannot be empty'),
    body('healthNotes').optional().trim(),
  ],
  async (req: express.Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.error('Validation errors:', errors.array());
        res.status(400).json({ errors: errors.array() });
        return;
      }

      // Normalize optional fields
      const profile: PetProfile = {
        name: req.body.name.trim(),
        ageMonths: parseInt(req.body.ageMonths, 10),
        breed: req.body.breed?.trim() || undefined,
        energyLevel: req.body.energyLevel,
        environment: req.body.environment,
        experienceLevel: req.body.experienceLevel,
        trainingGoals: Array.isArray(req.body.trainingGoals) 
          ? req.body.trainingGoals.map((g: string) => g.trim()).filter((g: string) => g.length > 0)
          : [],
        behaviorIssues: Array.isArray(req.body.behaviorIssues) && req.body.behaviorIssues.length > 0
          ? req.body.behaviorIssues.map((b: string) => b.trim()).filter((b: string) => b.length > 0)
          : undefined,
        healthNotes: req.body.healthNotes?.trim() || undefined,
      };

      // Build prompts
      const systemPrompt = SYSTEM_PROMPT;
      const userPrompt = buildUserPrompt(profile);

      // Call OpenAI API
      const openai = getOpenAIClient();
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.6,
        max_tokens: 2000,
      });

      const guide = completion.choices[0]?.message?.content;
      if (!guide) {
        res.status(500).json({ error: 'Failed to generate training guide' });
        return;
      }

      res.json({ guide });
    } catch (error: any) {
      console.error('Training guide generation error:', error);
      console.error('Error stack:', error.stack);
      
      if (error.message?.includes('OPENAI_API_KEY') || !process.env.OPENAI_API_KEY) {
        res.status(500).json({ 
          error: 'LLM service is not configured. Please set OPENAI_API_KEY in your environment variables.' 
        });
        return;
      }

      if (error.response?.status === 401) {
        res.status(500).json({ error: 'Invalid API key configuration. Please check your OPENAI_API_KEY.' });
        return;
      }

      // Log the full error for debugging
      const errorMessage = error.message || 'Unknown error';
      console.error('Full error details:', {
        message: errorMessage,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });

      res.status(500).json({ 
        error: 'Failed to generate training guide. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      });
    }
  }
);

export default router;
