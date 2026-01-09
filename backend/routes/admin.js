import express from 'express';
import {
  getAllOrders,
  updateOrderStatus,
  getAnalytics,
  getAllUsers,
  updateUser
} from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import admin from '../middleware/admin.js';

const router = express.Router();

// All admin routes are protected and require admin role
router.use(protect, admin);

// Orders
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Analytics
router.get('/analytics', getAnalytics);

// Users
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);

export default router;

