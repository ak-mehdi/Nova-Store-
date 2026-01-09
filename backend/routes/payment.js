import express from 'express';
import {
  createStripePaymentIntent,
  handleStripeWebhook,
  createPayPalOrder,
  capturePayPalPayment,
  getStripeConfig,
  getPayPalConfig
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public config routes
router.get('/stripe/config', getStripeConfig);
router.get('/paypal/config', getPayPalConfig);

// Stripe webhook (needs raw body)
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// Protected payment routes
router.post('/stripe/create-intent', protect, createStripePaymentIntent);
router.post('/paypal/create-order', protect, createPayPalOrder);
router.post('/paypal/capture', protect, capturePayPalPayment);

export default router;

