import asyncHandler from 'express-async-handler';
import Stripe from 'stripe';
import Cart from '../models/Cart.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create Stripe payment intent
// @route   POST /api/payment/stripe/create-intent
// @access  Private
export const createStripePaymentIntent = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error('Cart is empty');
  }

  // Calculate total
  let subtotal = 0;
  for (const item of cart.items) {
    if (!item.product || !item.product.isActive) {
      res.status(400);
      throw new Error('Some products are no longer available');
    }
    subtotal += item.product.price * item.quantity;
  }

  const shippingCost = subtotal >= 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = Math.round((subtotal + shippingCost + tax) * 100); // Convert to cents

  // Create payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: total,
    currency: 'usd',
    metadata: {
      userId: req.user._id.toString(),
      cartId: cart._id.toString()
    }
  });

  res.json({
    success: true,
    clientSecret: paymentIntent.client_secret,
    amount: total / 100
  });
});

// @desc    Handle Stripe webhook
// @route   POST /api/payment/stripe/webhook
// @access  Public
export const handleStripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    res.status(400);
    throw new Error(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// @desc    Create PayPal order
// @route   POST /api/payment/paypal/create-order
// @access  Private
export const createPayPalOrder = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error('Cart is empty');
  }

  // Calculate total
  let subtotal = 0;
  for (const item of cart.items) {
    if (!item.product || !item.product.isActive) {
      res.status(400);
      throw new Error('Some products are no longer available');
    }
    subtotal += item.product.price * item.quantity;
  }

  const shippingCost = subtotal >= 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = (subtotal + shippingCost + tax).toFixed(2);

  // Return order details for frontend to create PayPal order
  res.json({
    success: true,
    orderDetails: {
      subtotal: subtotal.toFixed(2),
      shipping: shippingCost.toFixed(2),
      tax: tax.toFixed(2),
      total
    }
  });
});

// @desc    Capture PayPal payment
// @route   POST /api/payment/paypal/capture
// @access  Private
export const capturePayPalPayment = asyncHandler(async (req, res) => {
  const { orderId, payerId } = req.body;

  // In production, you would verify the payment with PayPal here
  // For now, we just return success

  res.json({
    success: true,
    paymentResult: {
      id: orderId,
      status: 'COMPLETED',
      payer: payerId,
      updateTime: new Date().toISOString()
    }
  });
});

// @desc    Get Stripe publishable key
// @route   GET /api/payment/stripe/config
// @access  Public
export const getStripeConfig = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder'
  });
});

// @desc    Get PayPal client ID
// @route   GET /api/payment/paypal/config
// @access  Public
export const getPayPalConfig = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    clientId: process.env.PAYPAL_CLIENT_ID || 'test'
  });
});

