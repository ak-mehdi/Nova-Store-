import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiHeart, FiTrash2, FiShoppingCart } from 'react-icons/fi';
import { getWishlist, removeFromWishlist } from '../redux/slices/authSlice';
import { addToCartLocal, addToCartServer } from '../redux/slices/cartSlice';
import { PageLoading } from '../components/common/Loading';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const wishlist = user?.wishlist || [];

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getWishlist());
    }
  }, [dispatch, isAuthenticated]);

  const handleRemove = async (productId) => {
    try {
      await dispatch(removeFromWishlist(productId)).unwrap();
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove from wishlist');
    }
  };

  const handleAddToCart = (product) => {
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

  if (!user) {
    return <PageLoading />;
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-8 overflow-x-hidden w-full">
      <div className="container-custom">
        <h1 className="text-3xl font-heading font-bold text-secondary-900 mb-8">
          My Wishlist
        </h1>

        {wishlist.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto bg-secondary-100 rounded-full flex items-center justify-center mb-6">
              <FiHeart className="w-10 h-10 text-secondary-400" />
            </div>
            <h2 className="text-xl font-semibold text-secondary-900 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-secondary-500 mb-6">
              Save items you love by clicking the heart icon on products.
            </p>
            <Link to="/products" className="btn-primary">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <div key={product._id} className="bg-white rounded-xl shadow-card overflow-hidden group">
                {/* Image */}
                <Link to={`/products/${product.slug}`} className="block relative aspect-square bg-secondary-50">
                  <img
                    src={product.images?.[0] || '/placeholder.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.stock <= 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="px-3 py-1 bg-white text-secondary-900 rounded-full text-sm font-medium">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </Link>

                {/* Content */}
                <div className="p-4">
                  <Link to={`/products/${product.slug}`}>
                    <h3 className="font-medium text-secondary-900 line-clamp-2 hover:text-accent transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg font-bold text-secondary-900">
                      ${product.price?.toFixed(2)}
                    </span>
                    {product.comparePrice > product.price && (
                      <span className="text-sm text-secondary-400 line-through">
                        ${product.comparePrice?.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock <= 0}
                      className="flex-1 btn-primary btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiShoppingCart className="mr-1" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleRemove(product._id)}
                      className="p-2 border border-secondary-200 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;

