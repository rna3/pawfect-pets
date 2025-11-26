import express, { Response } from 'express';
import { body, validationResult } from 'express-validator';
import Booking from '../models/Booking';
import Service from '../models/Service';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// @route   GET /api/bookings
// @desc    Get all bookings for the authenticated user
// @access  Private
router.get('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const bookings = await Booking.findAll({
      where: { userId: req.user!.id },
      include: [
        {
          model: Service,
          as: 'service',
        },
      ],
      order: [['date', 'ASC']],
    });
    res.json(bookings);
  } catch (error: any) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get single booking
// @access  Private
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const booking = await Booking.findOne({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
      include: [
        {
          model: Service,
          as: 'service',
        },
      ],
    });

    if (!booking) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    res.json(booking);
  } catch (error: any) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post(
  '/',
  authenticateToken,
  [
    body('serviceId').isInt().withMessage('Service ID is required'),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('time').notEmpty().withMessage('Time is required'),
    // Allow optional endDate so boarding bookings can span multiple days.
    body('endDate').optional().isISO8601().withMessage('Valid end date is required'),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { serviceId, date, time, notes, endDate } = req.body;

      // Verify service exists
      const service = await Service.findByPk(serviceId);
      if (!service) {
        res.status(404).json({ error: 'Service not found' });
        return;
      }

      // Check if date is in the future
      const bookingDate = new Date(date);
      if (bookingDate < new Date()) {
        res.status(400).json({ error: 'Booking date must be in the future' });
        return;
      }

      // Boarding bookings require an endDate that is after the start date.
      if (service.category === 'boarding') {
        if (!endDate) {
          res.status(400).json({ error: 'Boarding services require an end date' });
          return;
        }

        const bookingEndDate = new Date(endDate);
        if (bookingEndDate <= bookingDate) {
          res.status(400).json({ error: 'End date must be after start date' });
          return;
        }
      }

      const booking = await Booking.create({
        userId: req.user!.id,
        serviceId,
        date: bookingDate,
        time,
        notes,
        endDate: endDate ? new Date(endDate) : null,
        status: 'pending',
      });

      // Fetch booking with service
      const createdBooking = await Booking.findByPk(booking.id, {
        include: [
          {
            model: Service,
            as: 'service',
          },
        ],
      });

      res.status(201).json(createdBooking);
    } catch (error: any) {
      console.error('Create booking error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// @route   PUT /api/bookings/:id
// @desc    Update a booking
// @access  Private
router.put(
  '/:id',
  authenticateToken,
  [
    // Validate optional fields used during rescheduling.
    body('date').optional().isISO8601().withMessage('Valid date is required'),
    body('time').optional().notEmpty().withMessage('Time cannot be empty'),
    body('endDate').optional().isISO8601().withMessage('Valid end date is required'),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const booking = await Booking.findOne({
        where: {
          id: req.params.id,
          userId: req.user!.id,
        },
      });

      if (!booking) {
        res.status(404).json({ error: 'Booking not found' });
        return;
      }

      const service = await Service.findByPk(booking.serviceId);

      const updates: Partial<{
        date: Date;
        time: string;
        endDate: Date | null;
      }> = {};

      if (req.body.date) {
        const newDate = new Date(req.body.date);
        if (newDate < new Date()) {
          res.status(400).json({ error: 'Booking date must be in the future' });
          return;
        }
        updates.date = newDate;
      }

      if (req.body.time) {
        updates.time = req.body.time;
      }

      if (req.body.endDate !== undefined) {
        const newEndDate = req.body.endDate ? new Date(req.body.endDate) : null;
        if (service?.category === 'boarding') {
          if (!newEndDate) {
            res.status(400).json({ error: 'Boarding services require an end date' });
            return;
          }
          const comparisonDate = updates.date ?? booking.date;
          if (newEndDate <= comparisonDate) {
            res.status(400).json({ error: 'End date must be after start date' });
            return;
          }
        }
        updates.endDate = newEndDate;
      }

      // Apply validated updates so only expected fields are persisted.
      await booking.update(updates);

      // Fetch updated booking with service
      const updatedBooking = await Booking.findByPk(booking.id, {
        include: [
          {
            model: Service,
            as: 'service',
          },
        ],
      });

      res.json(updatedBooking);
    } catch (error: any) {
      console.error('Update booking error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// @route   DELETE /api/bookings/:id
// @desc    Cancel a booking
// @access  Private
router.delete(
  '/:id',
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const booking = await Booking.findOne({
        where: {
          id: req.params.id,
          userId: req.user!.id,
        },
      });

      if (!booking) {
        res.status(404).json({ error: 'Booking not found' });
        return;
      }

      await booking.update({ status: 'cancelled' });
      res.json({ message: 'Booking cancelled successfully' });
    } catch (error: any) {
      console.error('Cancel booking error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

export default router;

