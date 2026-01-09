import { Link, useLocation } from 'react-router-dom';
import { 
  FiGrid, FiPackage, FiShoppingBag, FiUsers, FiTag, 
  FiSettings, FiArrowLeft 
} from 'react-icons/fi';

const menuItems = [
  { path: '/admin', icon: FiGrid, label: 'Dashboard', exact: true },
  { path: '/admin/products', icon: FiPackage, label: 'Products' },
  { path: '/admin/orders', icon: FiShoppingBag, label: 'Orders' },
  { path: '/admin/categories', icon: FiTag, label: 'Categories' },
];

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-secondary-900 min-h-screen fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="p-6 border-b border-secondary-800">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-heading font-bold text-white">
            Electro<span className="text-accent">.</span>
          </span>
        </Link>
        <p className="text-secondary-400 text-sm mt-1">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path, item.exact)
                    ? 'bg-accent text-secondary-900'
                    : 'text-secondary-300 hover:bg-secondary-800 hover:text-white'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <hr className="my-6 border-secondary-800" />

        <ul className="space-y-1">
          <li>
            <Link
              to="/admin/settings"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary-300 hover:bg-secondary-800 hover:text-white transition-colors"
            >
              <FiSettings size={20} />
              <span className="font-medium">Settings</span>
            </Link>
          </li>
          <li>
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary-300 hover:bg-secondary-800 hover:text-white transition-colors"
            >
              <FiArrowLeft size={20} />
              <span className="font-medium">Back to Store</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

