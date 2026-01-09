import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import {
  updateCartItemLocal,
  removeFromCartLocal,
  updateCartItemServer,
  removeFromCartServer,
  selectCartItems,
  selectCartTotal,
} from '../redux/slices/cartSlice';
import toast from 'react-hot-toast';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);

  const handleUpdateQuantity = (item, newQuantity) => {
    const productStock = item.product?.stock || 999;
    
    if (newQuantity > productStock) {
      toast.error('Not enough stock');
      return;
    }

    if (newQuantity <= 0) {
      handleRemoveItem(item);
      return;
    }

    if (isAuthenticated) {
      dispatch(updateCartItemServer({ itemId: item._id, quantity: newQuantity }));
    } else {
      dispatch(updateCartItemLocal({ itemId: item._id, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (item) => {
    if (isAuthenticated) {
      dispatch(removeFromCartServer(item._id));
    } else {
      dispatch(removeFromCartLocal(item._id));
    }
    toast.success('Item removed from cart');
  };

  const shippingCost = cartTotal >= 100 ? 0 : 10;
  const taxRate = 0.08;
  const tax = cartTotal * taxRate;
  const total = cartTotal + shippingCost + tax;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 overflow-x-hidden w-full">
        <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mb-6">
          <FiShoppingBag className="w-12 h-12 text-secondary-400" />
        </div>
        <h2 className="text-2xl font-heading font-bold text-secondary-900 mb-2">
          Your cart is empty
        </h2>
        <p className="text-secondary-500 mb-6">
          Looks like you haven't added any items to your cart yet.
        </p>
        <Link to="/products" className="btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-8 overflow-x-hidden w-full">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-heading font-bold text-secondary-900">
            Shopping Cart
          </h1>
          <span className="text-secondary-500">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const product = item.product || {};
              const productName = product.name || 'Product';
              const productImage = product.thumbnail || product.images?.[0] || '/placeholder.jpg';
              const productPrice = item.price || product.price || 0;
              const productSlug = product.slug || '';

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-card p-4 md:p-6 flex gap-4"
                >
                  {/* Image */}
                  <Link
                    to={`/products/${productSlug}`}
                    className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-secondary-50 rounded-lg overflow-hidden"
                  >
                    <img
                      src={productImage}
                      alt={productName}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/products/${productSlug}`}
                      className="font-medium text-secondary-900 hover:text-accent line-clamp-2"
                    >
                      {productName}
                    </Link>
                    
                    {product.brand && (
                      <p className="text-sm text-secondary-500 mt-1">{product.brand}</p>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-secondary-200 rounded-lg">
                        <button
                          onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                          className="p-2 hover:bg-secondary-50 transition-colors"
                        >
                          <FiMinus size={16} />
                        </button>
                        <span className="w-10 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                          className="p-2 hover:bg-secondary-50 transition-colors"
                        >
                          <FiPlus size={16} />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="font-bold text-secondary-900 text-lg">
                          ${(productPrice * item.quantity).toFixed(2)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-sm text-secondary-500">
                            ${productPrice.toFixed(2)} each
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveItem(item)}
                    className="p-2 text-secondary-400 hover:text-red-500 transition-colors self-start"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>
              );
            })}

            {/* Continue Shopping */}
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-secondary-600 hover:text-accent transition-colors mt-4"
            >
              <FiArrowLeft />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-card p-6 sticky top-28">
              <h2 className="text-xl font-semibold text-secondary-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-secondary-600">Subtotal</span>
                  <span className="font-medium">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Shipping</span>
                  <span className="font-medium">
                    {shippingCost === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `$${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Estimated Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <hr className="border-secondary-100" />
                <div className="flex justify-between text-lg">
                  <span className="font-semibold text-secondary-900">Total</span>
                  <span className="font-bold text-secondary-900">${total.toFixed(2)}</span>
                </div>
              </div>

              {shippingCost > 0 && (
                <div className="mb-6 p-4 bg-accent/10 rounded-lg">
                  <p className="text-sm text-secondary-700">
                    Add <strong>${(100 - cartTotal).toFixed(2)}</strong> more for free shipping!
                  </p>
                  <div className="w-full bg-secondary-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-accent h-2 rounded-full transition-all"
                      style={{ width: `${Math.min((cartTotal / 100) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  if (isAuthenticated) {
                    navigate('/checkout');
                  } else {
                    toast.error('Please login to proceed to checkout');
                    navigate('/login', { state: { from: { pathname: '/checkout' } } });
                  }
                }}
                className="w-full btn-primary py-4 text-lg"
              >
                Proceed to Checkout
              </button>

              {/* Secure Payment */}
              <p className="text-center text-sm text-secondary-500 mt-4">
                🔒 Secure checkout powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

