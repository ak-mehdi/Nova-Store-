import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode } from 'swiper/modules';
import {
  FiShoppingCart, FiHeart, FiShare2, FiCheck, FiMinus, FiPlus,
  FiTruck, FiShield, FiRotateCcw
} from 'react-icons/fi';
import { fetchProduct, fetchRelatedProducts, clearProduct, addReview } from '../redux/slices/productSlice';
import { addToCartLocal, addToCartServer } from '../redux/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../redux/slices/authSlice';
import ProductCarousel from '../components/product/ProductCarousel';
import { PageLoading } from '../components/common/Loading';
import toast from 'react-hot-toast';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

const ProductDetail = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { product, relatedProducts, isLoading } = useSelector((state) => state.products);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

  const isInWishlist = user?.wishlist?.some(
    (item) => (item._id || item) === product?._id
  );

  useEffect(() => {
    dispatch(fetchProduct(slug));
    dispatch(fetchRelatedProducts(slug));
    
    return () => {
      dispatch(clearProduct());
    };
  }, [dispatch, slug]);

  useEffect(() => {
    setQuantity(1);
  }, [product?._id]);

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) {
      toast.error('Product is out of stock');
      return;
    }

    if (quantity > product.stock) {
      toast.error('Not enough stock');
      return;
    }

    if (isAuthenticated) {
      dispatch(addToCartServer({ productId: product._id, quantity }));
    } else {
      dispatch(addToCartLocal({ product, quantity }));
    }
    toast.success('Added to cart');
  };

  const handleWishlist = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      return;
    }

    if (isInWishlist) {
      dispatch(removeFromWishlist(product._id));
      toast.success('Removed from wishlist');
    } else {
      dispatch(addToWishlist(product._id));
      toast.success('Added to wishlist');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to leave a review');
      return;
    }

    try {
      await dispatch(addReview({
        productId: product._id,
        reviewData: reviewForm
      })).unwrap();
      toast.success('Review added successfully');
      setReviewForm({ rating: 5, comment: '' });
    } catch (error) {
      toast.error(error || 'Failed to add review');
    }
  };

  if (isLoading || !product) {
    return <PageLoading />;
  }

  const discountPercentage = product.comparePrice && product.comparePrice > product.price
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-secondary-50 py-8 overflow-x-hidden w-full">
      <div className="container-custom">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm">
            <li><Link to="/" className="text-secondary-500 hover:text-accent">Home</Link></li>
            <li className="text-secondary-400">/</li>
            <li><Link to="/products" className="text-secondary-500 hover:text-accent">Products</Link></li>
            {product.category && (
              <>
                <li className="text-secondary-400">/</li>
                <li>
                  <Link to={`/category/${product.category.slug}`} className="text-secondary-500 hover:text-accent">
                    {product.category.name}
                  </Link>
                </li>
              </>
            )}
            <li className="text-secondary-400">/</li>
            <li className="text-secondary-900 font-medium truncate max-w-[200px]">{product.name}</li>
          </ol>
        </nav>

        {/* Product Section */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* Images */}
            <div>
              <Swiper
                modules={[Navigation, Thumbs]}
                navigation
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                className="rounded-xl overflow-hidden mb-4"
              >
                {(product.images?.length > 0 ? product.images : [product.thumbnail || '/placeholder.jpg']).map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="aspect-square bg-secondary-50">
                      <img
                        src={image}
                        alt={`${product.name} - ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {product.images?.length > 1 && (
                <Swiper
                  onSwiper={setThumbsSwiper}
                  modules={[FreeMode, Thumbs]}
                  spaceBetween={10}
                  slidesPerView={4}
                  freeMode
                  watchSlidesProgress
                  className="thumbs-swiper"
                >
                  {product.images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <div className="aspect-square cursor-pointer rounded-lg overflow-hidden border-2 border-transparent hover:border-accent transition-colors">
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>

            {/* Details */}
            <div>
              {/* Badges */}
              <div className="flex gap-2 mb-4">
                {discountPercentage > 0 && (
                  <span className="px-3 py-1 bg-red-100 text-red-600 text-sm font-semibold rounded-full">
                    {discountPercentage}% OFF
                  </span>
                )}
                {product.featured && (
                  <span className="px-3 py-1 bg-accent text-secondary-900 text-sm font-semibold rounded-full">
                    Featured
                  </span>
                )}
              </div>

              {/* Name & Brand */}
              <p className="text-sm text-secondary-500 uppercase tracking-wide mb-1">{product.brand}</p>
              <h1 className="text-2xl lg:text-3xl font-heading font-bold text-secondary-900 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              {product.ratings?.count > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < Math.round(product.ratings.average) ? 'text-yellow-400' : 'text-secondary-200'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-secondary-600">
                    {product.ratings.average.toFixed(1)} ({product.ratings.count} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-secondary-900">
                  ${product.price.toFixed(2)}
                </span>
                {product.comparePrice > product.price && (
                  <span className="text-xl text-secondary-400 line-through">
                    ${product.comparePrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Short Description */}
              {product.shortDescription && (
                <p className="text-secondary-600 mb-6">{product.shortDescription}</p>
              )}

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-6">
                {product.stock > 0 ? (
                  <>
                    <FiCheck className="text-green-500" />
                    <span className="text-green-600 font-medium">
                      In Stock ({product.stock} available)
                    </span>
                  </>
                ) : (
                  <span className="text-red-500 font-medium">Out of Stock</span>
                )}
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center border border-secondary-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-secondary-50 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <FiMinus />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-3 hover:bg-secondary-50 transition-colors"
                    disabled={quantity >= product.stock}
                  >
                    <FiPlus />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiShoppingCart />
                  Add to Cart
                </button>

                <button
                  onClick={handleWishlist}
                  className={`p-3 rounded-lg border transition-colors ${
                    isInWishlist
                      ? 'bg-red-50 border-red-200 text-red-500'
                      : 'border-secondary-200 hover:bg-secondary-50'
                  }`}
                >
                  <FiHeart className={isInWishlist ? 'fill-current' : ''} />
                </button>

                <button className="p-3 rounded-lg border border-secondary-200 hover:bg-secondary-50 transition-colors">
                  <FiShare2 />
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 py-6 border-t border-secondary-100">
                <div className="text-center">
                  <FiTruck className="w-6 h-6 mx-auto text-accent mb-2" />
                  <p className="text-sm text-secondary-600">Free Shipping</p>
                </div>
                <div className="text-center">
                  <FiShield className="w-6 h-6 mx-auto text-accent mb-2" />
                  <p className="text-sm text-secondary-600">2 Year Warranty</p>
                </div>
                <div className="text-center">
                  <FiRotateCcw className="w-6 h-6 mx-auto text-accent mb-2" />
                  <p className="text-sm text-secondary-600">30 Day Returns</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t border-secondary-100">
            <div className="flex border-b border-secondary-100">
              {['description', 'specifications', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? 'text-accent border-b-2 border-accent'
                      : 'text-secondary-500 hover:text-secondary-700'
                  }`}
                >
                  {tab} {tab === 'reviews' && `(${product.reviews?.length || 0})`}
                </button>
              ))}
            </div>

            <div className="p-6 lg:p-8">
              {activeTab === 'description' && (
                <div className="prose max-w-none text-secondary-600">
                  <p>{product.description}</p>
                  {product.features?.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-secondary-900 mb-4">Features</h3>
                      <ul className="space-y-2">
                        {product.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <FiCheck className="text-green-500 mt-1 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="grid gap-4 max-w-2xl">
                  {product.specifications?.map((spec, index) => (
                    <div
                      key={index}
                      className="flex py-3 border-b border-secondary-100 last:border-0"
                    >
                      <span className="w-1/3 font-medium text-secondary-900">{spec.key}</span>
                      <span className="w-2/3 text-secondary-600">{spec.value}</span>
                    </div>
                  ))}
                  {(!product.specifications || product.specifications.length === 0) && (
                    <p className="text-secondary-500">No specifications available.</p>
                  )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  {/* Review Form */}
                  {isAuthenticated && (
                    <form onSubmit={handleReviewSubmit} className="mb-8 p-6 bg-secondary-50 rounded-xl">
                      <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Rating</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                              className={`text-2xl ${star <= reviewForm.rating ? 'text-yellow-400' : 'text-secondary-300'}`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Comment</label>
                        <textarea
                          value={reviewForm.comment}
                          onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                          rows={4}
                          className="input"
                          placeholder="Share your thoughts about this product..."
                          required
                        />
                      </div>
                      <button type="submit" className="btn-primary">
                        Submit Review
                      </button>
                    </form>
                  )}

                  {/* Reviews List */}
                  {product.reviews?.length > 0 ? (
                    <div className="space-y-6">
                      {product.reviews.map((review, index) => (
                        <div key={index} className="border-b border-secondary-100 pb-6 last:border-0">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                              <span className="font-semibold text-secondary-900">
                                {review.name?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-secondary-900">{review.name}</p>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-secondary-200'}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-secondary-600">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-secondary-500">No reviews yet. Be the first to review this product!</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <ProductCarousel
              products={relatedProducts}
              title="Related Products"
              subtitle="You might also like"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;

