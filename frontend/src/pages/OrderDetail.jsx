import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiArrowLeft, FiTruck, FiPackage, FiCheck, FiX } from 'react-icons/fi';
import { fetchOrder, cancelOrder } from '../redux/slices/orderSlice';
import { PageLoading } from '../components/common/Loading';
import toast from 'react-hot-toast';

const statusSteps = ['pending', 'processing', 'shipped', 'delivered'];

const OrderDetail = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { currentOrder: order, isLoading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrder(orderId));
  }, [dispatch, orderId]);

  const handleCancelOrder = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await dispatch(cancelOrder(orderId)).unwrap();
        toast.success('Order cancelled successfully');
      } catch (error) {
        toast.error(error || 'Failed to cancel order');
      }
    }
  };

  if (isLoading || !order) {
    return <PageLoading />;
  }

  const currentStepIndex = statusSteps.indexOf(order.status);

  return (
    <div className="min-h-screen bg-secondary-50 py-8 overflow-x-hidden w-full">
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/orders"
            className="p-2 hover:bg-secondary-200 rounded-lg transition-colors"
          >
            <FiArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-secondary-900">
              Order {order.orderNumber}
            </h1>
            <p className="text-secondary-500">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            {order.status !== 'cancelled' && (
              <div className="bg-white rounded-xl shadow-card p-6">
                <h2 className="text-lg font-semibold mb-6">Order Status</h2>
                <div className="relative">
                  <div className="absolute top-5 left-0 right-0 h-0.5 bg-secondary-200" />
                  <div
                    className="absolute top-5 left-0 h-0.5 bg-accent transition-all"
                    style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                  />
                  <div className="relative flex justify-between">
                    {statusSteps.map((step, index) => (
                      <div key={step} className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                            index <= currentStepIndex
                              ? 'bg-accent text-secondary-900'
                              : 'bg-secondary-200 text-secondary-500'
                          }`}
                        >
                          {index < currentStepIndex ? (
                            <FiCheck />
                          ) : index === 0 ? (
                            <FiPackage size={18} />
                          ) : index === statusSteps.length - 1 ? (
                            <FiCheck size={18} />
                          ) : (
                            <FiTruck size={18} />
                          )}
                        </div>
                        <span
                          className={`mt-2 text-sm capitalize ${
                            index <= currentStepIndex ? 'text-secondary-900 font-medium' : 'text-secondary-500'
                          }`}
                        >
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {order.status === 'cancelled' && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <FiX className="text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-700">Order Cancelled</h3>
                    <p className="text-red-600 text-sm">This order has been cancelled.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-card p-6">
              <h2 className="text-lg font-semibold mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex gap-4 py-4 border-b border-secondary-100 last:border-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-secondary-900">{item.name}</h3>
                      <p className="text-secondary-500 text-sm">Quantity: {item.quantity}</p>
                      <p className="text-secondary-500 text-sm">${item.price?.toFixed(2)} each</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-secondary-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-xl shadow-card p-6">
              <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
              <div className="text-secondary-600">
                <p className="font-medium text-secondary-900">{order.shippingAddress?.fullName}</p>
                <p>{order.shippingAddress?.street}</p>
                <p>
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}{' '}
                  {order.shippingAddress?.postalCode}
                </p>
                <p>{order.shippingAddress?.country}</p>
                <p className="mt-2">Phone: {order.shippingAddress?.phone}</p>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-card p-6 sticky top-28">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-secondary-600">Subtotal</span>
                  <span>${order.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Shipping</span>
                  <span>
                    {order.shippingCost === 0 ? 'FREE' : `$${order.shippingCost?.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Tax</span>
                  <span>${order.tax?.toFixed(2)}</span>
                </div>
                <hr className="border-secondary-100" />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${order.total?.toFixed(2)}</span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium mb-2">Payment Method</h3>
                <p className="text-secondary-600 capitalize">{order.paymentMethod}</p>
                {order.isPaid && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                    Paid on {new Date(order.paidAt).toLocaleDateString()}
                  </span>
                )}
              </div>

              {order.trackingNumber && (
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Tracking Number</h3>
                  <p className="text-accent font-mono">{order.trackingNumber}</p>
                </div>
              )}

              {['pending', 'processing'].includes(order.status) && (
                <button
                  onClick={handleCancelOrder}
                  className="w-full btn-outline text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;

