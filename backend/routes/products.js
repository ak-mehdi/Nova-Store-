import express from 'express';
import {
  getProducts,
  getProduct,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  getFeaturedProducts,
  getBestsellingProducts,
  getDeals,
  searchProducts,
  getAllProductsAdmin
} from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';
import admin from '../middleware/admin.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/bestselling', getBestsellingProducts);
router.get('/deals', getDeals);
router.get('/search', searchProducts);
router.get('/:slug', getProduct);
router.get('/:slug/related', getRelatedProducts);

// Protected routes
router.post('/:id/reviews', protect, addReview);

// Admin routes
router.get('/admin/all', protect, admin, getAllProductsAdmin);
router.post('/', protect, admin, upload.array('images', 5), createProduct);
router.put('/:id', protect, admin, upload.array('images', 5), updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

export default router;

