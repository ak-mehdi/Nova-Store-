import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 12;

  let products = await Product.find({ isActive: true }).populate('category');
  
  // Filter by category
  if (req.query.category) {
    const category = await Category.findOne({ slug: req.query.category });
    if (category) {
      products = products.filter(p => p.category && p.category._id === category._id);
    }
  }
  
  // Filter by featured
  if (req.query.featured === 'true') {
    products = products.filter(p => p.featured);
  }
  
  // Sort
  if (req.query.sort === 'price-asc') {
    products.sort((a, b) => a.price - b.price);
  } else if (req.query.sort === 'price-desc') {
    products.sort((a, b) => b.price - a.price);
  }
  
  const total = products.length;
  const start = (page - 1) * limit;
  const paginatedProducts = products.slice(start, start + limit);

  res.json({
    success: true,
    data: paginatedProducts,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  });
});

// @desc    Get single product by slug
// @route   GET /api/products/:slug
// @access  Public
export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate('category');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({ success: true, data: product });
});

// @desc    Get related products
// @route   GET /api/products/:slug/related
// @access  Public
export const getRelatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate('category');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  let related = await Product.find({ isActive: true }).populate('category');
  related = related.filter(p => 
    p.category && product.category && 
    p.category._id === product.category._id && 
    p._id !== product._id
  ).slice(0, 8);

  res.json({ success: true, data: related });
});

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, data: product });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, data: product });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await Product.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ success: true, message: 'Product deleted successfully' });
});

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
export const addReview = asyncHandler(async (req, res) => {
  res.json({ success: true, data: [] });
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 8;
  let products = await Product.find({ featured: true, isActive: true }).populate('category');
  products = products.slice(0, limit);
  res.json({ success: true, data: products });
});

// @desc    Get bestselling products
// @route   GET /api/products/bestselling
// @access  Public
export const getBestsellingProducts = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 8;
  let products = await Product.find({ isActive: true }).populate('category');
  products.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
  products = products.slice(0, limit);
  res.json({ success: true, data: products });
});

// @desc    Get deals
// @route   GET /api/products/deals
// @access  Public
export const getDeals = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 8;
  let products = await Product.find({ isActive: true }).populate('category');
  products = products.filter(p => p.comparePrice && p.comparePrice > p.price).slice(0, limit);
  res.json({ success: true, data: products });
});

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
export const searchProducts = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q) {
    res.json({ success: true, data: [] });
    return;
  }

  let products = await Product.find({ isActive: true }).populate('category');
  const query = q.toLowerCase();
  products = products.filter(p => 
    p.name.toLowerCase().includes(query) || 
    (p.brand && p.brand.toLowerCase().includes(query))
  ).slice(0, 10);

  res.json({ success: true, data: products });
});

// @desc    Get all products for admin
// @route   GET /api/products/admin/all
// @access  Private/Admin
export const getAllProductsAdmin = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  
  let products = await Product.find({}).populate('category');
  const total = products.length;
  const start = (page - 1) * limit;
  products = products.slice(start, start + limit);

  res.json({
    success: true,
    data: products,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  });
});
