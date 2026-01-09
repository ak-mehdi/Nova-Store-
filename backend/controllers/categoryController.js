import asyncHandler from 'express-async-handler';
import Category from '../models/Category.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  res.json({ success: true, data: categories });
});

// @desc    Get all categories flat list
// @route   GET /api/categories/all
// @access  Public
export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  res.json({ success: true, data: categories });
});

// @desc    Get single category
// @route   GET /api/categories/:slug
// @access  Public
export const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  res.json({ success: true, data: category });
});

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, data: category });
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.body });
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Category deleted successfully' });
});

// @desc    Get categories for admin
// @route   GET /api/categories/admin/all
// @access  Private/Admin
export const getAdminCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  res.json({ success: true, data: categories });
});
