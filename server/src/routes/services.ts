import express, { Response } from 'express';
import { body, validationResult } from 'express-validator';
import Service from '../models/Service';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';

const router = express.Router();

// @route   GET /api/services
// @desc    Get all services
// @access  Public
router.get('/', async (req: express.Request, res: Response): Promise<void> => {
  try {
    const services = await Service.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.json(services);
  } catch (error: any) {
    console.error('Get services error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/services/:id
// @desc    Get single service
// @access  Public
router.get('/:id', async (req: express.Request, res: Response): Promise<void> => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) {
      res.status(404).json({ error: 'Service not found' });
      return;
    }
    res.json(service);
  } catch (error: any) {
    console.error('Get service error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/services
// @desc    Create a new service
// @access  Admin
router.post(
  '/',
  authenticateToken,
  requireAdmin,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
    body('category').isIn(['walking', 'boarding', 'training', 'grooming', 'pet_sitting']).withMessage('Invalid category'),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const service = await Service.create(req.body);
      res.status(201).json(service);
    } catch (error: any) {
      console.error('Create service error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// @route   PUT /api/services/:id
// @desc    Update a service
// @access  Admin
router.put(
  '/:id',
  authenticateToken,
  requireAdmin,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const service = await Service.findByPk(req.params.id);
      if (!service) {
        res.status(404).json({ error: 'Service not found' });
        return;
      }

      await service.update(req.body);
      res.json(service);
    } catch (error: any) {
      console.error('Update service error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// @route   DELETE /api/services/:id
// @desc    Delete a service
// @access  Admin
router.delete(
  '/:id',
  authenticateToken,
  requireAdmin,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const service = await Service.findByPk(req.params.id);
      if (!service) {
        res.status(404).json({ error: 'Service not found' });
        return;
      }

      await service.destroy();
      res.json({ message: 'Service deleted successfully' });
    } catch (error: any) {
      console.error('Delete service error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

export default router;

