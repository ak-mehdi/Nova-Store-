import express from 'express';
import {
  createOrder,
  getOrder,
  getMyOrders,
  cancelOrder
} from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All order routes are protected
router.use(protect);

router.route('/')
  .get(getMyOrders)
  .post(createOrder);

router.get('/:id', getOrder);
router.put('/:id/cancel', cancelOrder);

export default router;

