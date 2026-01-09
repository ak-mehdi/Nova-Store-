import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiCheckCircle, FiPackage, FiMail } from 'react-icons/fi';
import { fetchOrder } from '../redux/slices/orderSlice';
import { PageLoading } from '../components/common/Loading';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { currentOrder, isLoading } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrder(orderId));
    }
  }, [dispatch, orderId]);

  if (isLoading || !currentOrder) {
    return <PageLoading />;
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-secondary-50 py-12 px-4 overflow-x-hidden w-full">
      <div className="max-w-lg w-full text-center">
        <div className="bg-white rounded-2xl shadow-card p-8">
          {/* Success Icon */}
          <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
            <FiCheckCircle className="w-10 h-10 text-green-500" />
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-secondary-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-secondary-500 mb-6">
            Thank you for your purchase, {user?.name?.split(' ')[0]}!
          </p>

          {/* Order Details */}
          <div className="bg-secondary-50 rounded-xl p-6 mb-6 text-left">
            <div className="flex items-center gap-3 mb-4">
              <FiPackage className="text-accent" size={24} />
              <div>
                <p className="text-sm text-secondary-500">Order Number</p>
                <p className="font-semibold text-secondary-900">{currentOrder.orderNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FiMail className="text-accent" size={24} />
              <div>
                <p className="text-sm text-secondary-500">Confirmation Email</p>
                <p className="font-semibold text-secondary-900">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t border-secondary-100 pt-6 mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-secondary-600">Subtotal</span>
              <span>${currentOrder.subtotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-secondary-600">Shipping</span>
              <span>
                {currentOrder.shippingCost === 0 ? 'FREE' : `$${currentOrder.shippingCost?.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-secondary-600">Tax</span>
              <span>${currentOrder.tax?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold text-secondary-900 pt-2 border-t border-secondary-100">
              <span>Total</span>
              <span>${currentOrder.total?.toFixed(2)}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to={`/orders/${currentOrder._id}`}
              className="flex-1 btn-outline"
            >
              View Order
            </Link>
            <Link
              to="/products"
              className="flex-1 btn-primary"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Additional Info */}
        <p className="mt-6 text-sm text-secondary-500">
          You will receive an email confirmation shortly at {user?.email}
        </p>
      </div>
    </div>
  );
};

export default OrderSuccess;

