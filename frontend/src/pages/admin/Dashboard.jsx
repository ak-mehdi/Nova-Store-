import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiDollarSign, FiShoppingBag, FiUsers, FiPackage, FiTrendingUp } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../../utils/api';
import { PageLoading } from '../../components/common/Loading';

const COLORS = ['#FEBD69', '#232F3E', '#3B82F6', '#10B981', '#EF4444'];

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await api.get('/admin/analytics');
        setAnalytics(data.data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return <PageLoading />;
  }

  const stats = [
    {
      title: 'Total Revenue',
      value: `$${analytics?.overview?.totalRevenue?.toFixed(2) || '0.00'}`,
      icon: FiDollarSign,
      color: 'bg-green-500',
      change: '+12.5%',
    },
    {
      title: 'Total Orders',
      value: analytics?.overview?.totalOrders || 0,
      icon: FiShoppingBag,
      color: 'bg-blue-500',
      change: '+8.2%',
    },
    {
      title: 'Total Customers',
      value: analytics?.overview?.totalCustomers || 0,
      icon: FiUsers,
      color: 'bg-purple-500',
      change: '+5.1%',
    },
    {
      title: 'Total Products',
      value: analytics?.overview?.totalProducts || 0,
      icon: FiPackage,
      color: 'bg-accent',
      change: '+2.3%',
    },
  ];

  return (
    <div className="min-h-screen bg-secondary-50 py-8 overflow-x-hidden w-full">
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-secondary-900">
              Dashboard
            </h1>
            <p className="text-secondary-500">Welcome back, Admin!</p>
          </div>
          <div className="flex gap-3">
            <Link to="/admin/products" className="btn-outline">
              Manage Products
            </Link>
            <Link to="/admin/orders" className="btn-primary">
              View Orders
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-green-500 text-sm font-medium flex items-center gap-1">
                  <FiTrendingUp size={14} />
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
              <p className="text-secondary-500 text-sm">{stat.title}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-card p-6">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4">Revenue Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics?.salesByDay || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="_id" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: '#232F3E',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#FEBD69"
                  fill="#FEBD69"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Sales by Category */}
          <div className="bg-white rounded-xl shadow-card p-6">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4">Sales by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics?.salesByCategory || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="sales"
                  nameKey="_id"
                >
                  {analytics?.salesByCategory?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#232F3E',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  formatter={(value) => `$${value.toFixed(2)}`}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {analytics?.salesByCategory?.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm text-secondary-600">{item._id}</span>
                  </div>
                  <span className="text-sm font-medium">${item.sales?.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-secondary-900">Recent Orders</h2>
              <Link to="/admin/orders" className="text-accent hover:text-accent-dark text-sm">
                View All →
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-secondary-500 text-sm border-b border-secondary-100">
                    <th className="pb-3">Order</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Total</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-100">
                  {analytics?.recentOrders?.slice(0, 5).map((order) => (
                    <tr key={order._id}>
                      <td className="py-3">
                        <Link
                          to={`/admin/orders`}
                          className="text-secondary-900 hover:text-accent font-medium"
                        >
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="py-3 text-secondary-600">{order.user?.name}</td>
                      <td className="py-3 font-medium">${order.total?.toFixed(2)}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                            order.status === 'delivered'
                              ? 'bg-green-100 text-green-700'
                              : order.status === 'cancelled'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-secondary-900">Top Selling Products</h2>
              <Link to="/admin/products" className="text-accent hover:text-accent-dark text-sm">
                View All →
              </Link>
            </div>
            <div className="space-y-4">
              {analytics?.topProducts?.map((product, index) => (
                <div key={product._id} className="flex items-center gap-4">
                  <span className="w-6 h-6 bg-secondary-100 rounded-full flex items-center justify-center text-sm font-medium text-secondary-600">
                    {index + 1}
                  </span>
                  <img
                    src={product.thumbnail || product.images?.[0]}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-secondary-900 truncate">{product.name}</p>
                    <p className="text-sm text-secondary-500">${product.price?.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-secondary-900">{product.soldCount} sold</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

