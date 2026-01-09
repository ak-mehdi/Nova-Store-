import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiPackage, FiEye } from 'react-icons/fi';
import { fetchOrders } from '../redux/slices/orderSlice';
import { PageLoading } from '../components/common/Loading';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const OrderHistory = () => {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (isLoading) {
    return <PageLoading />;
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-8 overflow-x-hidden w-full">
      <div className="container-custom">
        <h1 className="text-3xl font-heading font-bold text-secondary-900 mb-8">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto bg-secondary-100 rounded-full flex items-center justify-center mb-6">
              <FiPackage className="w-10 h-10 text-secondary-400" />
            </div>
            <h2 className="text-xl font-semibold text-secondary-900 mb-2">
              No orders yet
            </h2>
            <p className="text-secondary-500 mb-6">
              When you place orders, they will appear here.
            </p>
            <Link to="/products" className="btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-card p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-sm text-secondary-500">Order Number</p>
                    <p className="font-semibold text-secondary-900">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-500">Date</p>
                    <p className="font-medium text-secondary-900">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-500">Total</p>
                    <p className="font-semibold text-secondary-900">
                      ${order.total?.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-500">Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize ${
                        statusColors[order.status] || 'bg-secondary-100 text-secondary-700'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="flex items-center gap-3 mb-4 overflow-x-auto pb-2">
                  {order.items?.slice(0, 4).map((item, index) => (
                    <img
                      key={index}
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                  ))}
                  {order.items?.length > 4 && (
                    <div className="w-16 h-16 bg-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-secondary-600 font-medium">
                        +{order.items.length - 4}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-secondary-100">
                  <p className="text-sm text-secondary-500">
                    {order.items?.length} {order.items?.length === 1 ? 'item' : 'items'}
                  </p>
                  <Link
                    to={`/orders/${order._id}`}
                    className="btn-outline btn-sm"
                  >
                    <FiEye className="mr-2" />
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;

