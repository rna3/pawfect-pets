import express, { Response } from 'express';
import { body, validationResult } from 'express-validator';
import Order from '../models/Order';
import OrderItem from '../models/OrderItem';
import Product from '../models/Product';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// @route   GET /api/orders
// @desc    Get all orders for the authenticated user
// @access  Private
router.get('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user!.id },
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(orders);
  } catch (error: any) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findOne({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
            },
          ],
        },
      ],
    });

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    res.json(order);
  } catch (error: any) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private
router.post(
  '/',
  authenticateToken,
  [
    body('items').isArray({ min: 1 }).withMessage('Order must have at least one item'),
    body('items.*.productId').isInt().withMessage('Invalid product ID'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { items } = req.body;

      // Calculate total and validate products
      let total = 0;
      const orderItems = [];

      for (const item of items) {
        const product = await Product.findByPk(item.productId);
        if (!product) {
          res.status(404).json({ error: `Product with ID ${item.productId} not found` });
          return;
        }

        if (product.stock < item.quantity) {
          res.status(400).json({ error: `Insufficient stock for ${product.name}` });
          return;
        }

        const itemTotal = parseFloat(product.price.toString()) * item.quantity;
        total += itemTotal;

        orderItems.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
        });
      }

      // Create order
      const order = await Order.create({
        userId: req.user!.id,
        total,
        status: 'pending',
      });

      // Create order items and update stock
      for (const item of orderItems) {
        await OrderItem.create({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        });

        // Update product stock
        const product = await Product.findByPk(item.productId);
        if (product) {
          await product.update({
            stock: product.stock - item.quantity,
          });
        }
      }

      // Fetch order with items
      const createdOrder = await Order.findByPk(order.id, {
        include: [
          {
            model: OrderItem,
            as: 'items',
            include: [
              {
                model: Product,
                as: 'product',
              },
            ],
          },
        ],
      });

      res.status(201).json(createdOrder);
    } catch (error: any) {
      console.error('Create order error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

export default router;

