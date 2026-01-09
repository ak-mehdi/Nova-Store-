import express from 'express';
import {
  getCategories,
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getAdminCategories
} from '../controllers/categoryController.js';
import { protect } from '../middleware/auth.js';
import admin from '../middleware/admin.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/all', getAllCategories);
router.get('/:slug', getCategory);

// Admin routes
router.get('/admin/all', protect, admin, getAdminCategories);
router.post('/', protect, admin, upload.single('image'), createCategory);
router.put('/:id', protect, admin, upload.single('image'), updateCategory);
router.delete('/:id', protect, admin, deleteCategory);

export default router;

