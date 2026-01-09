import asyncHandler from 'express-async-handler';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

  if (!cart) {
    cart = { items: [], totalItems: 0, totalPrice: 0 };
  }

  res.json({ success: true, data: cart });
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [{ product: productId, quantity, price: product.price }]
    });
  } else {
    const existingItem = cart.items?.find(item => {
      const itemProductId = item.product?._id ? item.product._id.toString() : item.product.toString();
      return itemProductId === productId.toString();
    });
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items = cart.items || [];
      cart.items.push({ product: productId, quantity, price: product.price });
    }
    
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: cart.items });
  }

  cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  res.json({ success: true, data: cart });
});

// @desc    Update cart item
// @route   PUT /api/cart/:itemId
// @access  Private
export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  const item = cart.items?.find(item => {
    const itemProductId = item.product?._id ? item.product._id.toString() : item.product.toString();
    return itemProductId === req.params.itemId;
  });
  
  if (item) {
    item.quantity = quantity;
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: cart.items });
  }

  cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  res.json({ success: true, data: cart });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
export const removeFromCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  cart.items = cart.items?.filter(item => {
    const itemProductId = item.product?._id ? item.product._id.toString() : item.product.toString();
    return itemProductId !== req.params.itemId;
  }) || [];
  
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: cart.items });

  cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  res.json({ success: true, data: cart });
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] }, { upsert: true });
  res.json({ success: true, data: { items: [] } });
});

// @desc    Sync cart (merge local cart with server)
// @route   POST /api/cart/sync
// @access  Private
export const syncCart = asyncHandler(async (req, res) => {
  const { items } = req.body;
  
  if (items && items.length > 0) {
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items },
      { upsert: true, new: true }
    );
  }
  
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  res.json({ success: true, data: cart || { items: [] } });
});
