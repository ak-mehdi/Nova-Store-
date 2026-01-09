import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiShoppingCart, FiHeart, FiEye } from 'react-icons/fi';
import { addToCartLocal, addToCartServer } from '../../redux/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const isInWishlist = user?.wishlist?.some(
    (item) => (item._id || item) === product._id
  );

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock <= 0) {
      toast.error('Product is out of stock');
      return;
    }

    if (isAuthenticated) {
      dispatch(addToCartServer({ productId: product._id, quantity: 1 }));
    } else {
      dispatch(addToCartLocal({ product, quantity: 1 }));
    }
    toast.success('Added to cart');
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

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

  const discountPercentage = product.comparePrice && product.comparePrice > product.price
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <div className="product-card group">
      {/* Image */}
      <Link to={`/products/${product.slug}`} className="product-card-image block relative">
        <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />
        <img
          src={product.thumbnail || product.images?.[0] || '/placeholder.jpg'}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
          {discountPercentage > 0 && (
            <span className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-lg shadow-lg">
              -{discountPercentage}% OFF
            </span>
          )}
          {product.featured && (
            <span className="px-3 py-1.5 bg-gradient-to-r from-accent to-yellow-400 text-secondary-900 text-xs font-bold rounded-lg shadow-lg">
              ⭐ Featured
            </span>
          )}
          {product.stock <= 0 && (
            <span className="px-3 py-1.5 bg-secondary-700 text-white text-xs font-bold rounded-lg shadow-lg">
              Out of Stock
            </span>
          )}
        </div>

        {/* Actions Overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
          <button
            onClick={handleAddToCart}
            className="w-12 h-12 rounded-full bg-white text-secondary-900 flex items-center justify-center hover:bg-accent hover:text-secondary-900 transition-all duration-200 transform translate-y-4 group-hover:translate-y-0 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            title="Add to Cart"
            disabled={product.stock <= 0}
          >
            <FiShoppingCart size={20} />
          </button>
          <button
            onClick={handleWishlist}
            className={`w-12 h-12 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-200 transform translate-y-4 group-hover:translate-y-0 shadow-xl ${isInWishlist ? 'bg-red-500 text-white' : 'bg-white text-secondary-900'}`}
            title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <FiHeart size={20} className={isInWishlist ? 'fill-current' : ''} />
          </button>
          <Link
            to={`/products/${product.slug}`}
            className="w-12 h-12 rounded-full bg-white text-secondary-900 flex items-center justify-center hover:bg-accent hover:text-secondary-900 transition-all duration-200 transform translate-y-4 group-hover:translate-y-0 shadow-xl"
            title="Quick View"
          >
            <FiEye size={20} />
          </Link>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5">
        {/* Category & Brand */}
        <div className="flex items-center justify-between mb-2">
          {product.category && (
            <Link
              to={`/category/${product.category.slug}`}
              className="text-xs text-accent hover:text-accent-dark uppercase tracking-wider font-semibold"
            >
              {product.category.name}
            </Link>
          )}
          {product.brand && (
            <span className="text-xs text-secondary-400 font-medium">
              {product.brand}
            </span>
          )}
        </div>

        {/* Name */}
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-semibold text-secondary-900 mt-1 line-clamp-2 hover:text-accent transition-colors min-h-[2.5rem] text-[15px] leading-tight">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.ratings?.count > 0 && (
          <div className="flex items-center gap-2 mt-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < Math.round(product.ratings.average) ? 'text-yellow-400' : 'text-secondary-200'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-secondary-500 font-medium">
              ({product.ratings.count})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-4">
          <span className="text-2xl font-bold text-secondary-900">
            ${product.price.toFixed(2)}
          </span>
          {product.comparePrice > product.price && (
            <span className="text-sm text-secondary-400 line-through font-medium">
              ${product.comparePrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Stock Status with visual indicator */}
        <div className="mt-3 flex items-center gap-2">
          {product.stock > 0 ? (
            <>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600 font-medium">In Stock</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm text-red-500 font-medium">Out of Stock</span>
            </>
          )}
        </div>

        {/* Quick Add to Cart Button (visible on hover) */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className="w-full mt-4 py-2.5 bg-secondary-100 text-secondary-900 rounded-lg font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-accent hover:text-secondary-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <FiShoppingCart size={16} />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

