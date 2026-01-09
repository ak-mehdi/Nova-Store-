import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FiSearch, FiShoppingCart, FiHeart, FiUser, FiMenu, FiX, 
  FiChevronDown, FiLogOut, FiPackage, FiSettings, FiGrid
} from 'react-icons/fi';
import { logout } from '../../redux/slices/authSlice';
import { selectCartCount } from '../../redux/slices/cartSlice';
import { fetchCategories, searchProducts } from '../../redux/slices/productSlice';
import MegaMenu from './MegaMenu';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const cartCount = useSelector(selectCartCount);
  const { categories } = useSelector((state) => state.products);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        try {
          const result = await dispatch(searchProducts(searchQuery)).unwrap();
          setSearchResults(result);
        } catch (error) {
          console.error('Search error:', error);
        }
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchQuery, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  return (
    <header className="sticky top-0 z-50 overflow-x-hidden w-full">
      {/* Top Bar */}
      <div className="bg-secondary-900 text-white py-2">
        <div className="container-custom">
          <div className="flex items-center justify-between text-sm">
            <div className="hidden md:flex items-center gap-4">
              <span>Welcome to NovaStore</span>
              <span className="text-secondary-400">|</span>
              <span className="text-accent">Free Shipping on orders over $100</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/orders" className="hover:text-accent transition-colors">Track Order</Link>
              {isAuthenticated && user?.role === 'admin' && (
                <Link to="/admin" className="hover:text-accent transition-colors flex items-center gap-1">
                  <FiGrid size={14} />
                  Admin
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white shadow-sm">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 hover:bg-secondary-100 rounded-lg"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-2xl md:text-3xl font-heading font-bold">
                <span className="text-secondary-900">Nova</span>
                <span className="text-accent">Store</span>
              </h1>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:block flex-1 max-w-2xl" ref={searchRef}>
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-3 pl-4 pr-12 bg-secondary-50 border border-secondary-200 rounded-full focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-accent rounded-full hover:bg-accent-dark transition-colors"
                >
                  <FiSearch className="text-secondary-900" />
                </button>

                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-dropdown max-h-96 overflow-y-auto z-50">
                    {searchResults.map((product) => (
                      <Link
                        key={product._id}
                        to={`/products/${product.slug}`}
                        className="flex items-center gap-3 p-3 hover:bg-secondary-50 transition-colors"
                        onClick={() => {
                          setSearchQuery('');
                          setSearchResults([]);
                        }}
                      >
                        <img
                          src={product.thumbnail || product.images?.[0]}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium text-secondary-900 line-clamp-1">{product.name}</p>
                          <p className="text-accent font-semibold">${product.price.toFixed(2)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </form>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Wishlist */}
              {isAuthenticated && (
                <Link
                  to="/wishlist"
                  className="p-2 hover:bg-secondary-100 rounded-full transition-colors relative"
                >
                  <FiHeart size={22} />
                </Link>
              )}

              {/* Cart */}
              <Link
                to="/cart"
                className="p-2 hover:bg-secondary-100 rounded-full transition-colors relative"
              >
                <FiShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-secondary-900 text-xs font-bold rounded-full flex items-center justify-center">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center gap-2 p-2 hover:bg-secondary-100 rounded-lg transition-colors"
                    >
                      <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                        <span className="text-secondary-900 font-semibold text-sm">
                          {user?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="hidden md:block text-sm font-medium">
                        {user?.name?.split(' ')[0]}
                      </span>
                      <FiChevronDown size={16} className={`hidden md:block transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-dropdown py-2 animate-fade-in">
                        <div className="px-4 py-2 border-b border-secondary-100">
                          <p className="font-medium text-secondary-900">{user?.name}</p>
                          <p className="text-sm text-secondary-500">{user?.email}</p>
                        </div>
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-4 py-2 hover:bg-secondary-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <FiSettings size={18} />
                          <span>My Account</span>
                        </Link>
                        <Link
                          to="/orders"
                          className="flex items-center gap-3 px-4 py-2 hover:bg-secondary-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <FiPackage size={18} />
                          <span>My Orders</span>
                        </Link>
                        <Link
                          to="/wishlist"
                          className="flex items-center gap-3 px-4 py-2 hover:bg-secondary-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <FiHeart size={18} />
                          <span>Wishlist</span>
                        </Link>
                        <hr className="my-2 border-secondary-100" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2 w-full hover:bg-red-50 text-red-600 transition-colors"
                        >
                          <FiLogOut size={18} />
                          <span>Logout</span>
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-4 py-2 bg-secondary-900 text-white rounded-lg hover:bg-secondary-800 transition-colors"
                  >
                    <FiUser size={18} />
                    <span className="hidden md:block">Login</span>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-4 pr-10 bg-secondary-50 border border-secondary-200 rounded-full focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <FiSearch className="text-secondary-500" />
              </button>
            </form>
          </div>
        </div>

        {/* Navigation / Categories Bar */}
        <div className="border-t border-secondary-100">
          <div className="container-custom">
            <nav className="hidden lg:flex items-center gap-1 py-2">
              <div
                className="relative"
                onMouseEnter={() => setIsMegaMenuOpen(true)}
                onMouseLeave={() => setIsMegaMenuOpen(false)}
              >
                <button className="flex items-center gap-2 px-4 py-2 bg-accent text-secondary-900 rounded-lg font-medium hover:bg-accent-dark transition-colors">
                  <FiMenu size={18} />
                  <span>All Categories</span>
                  <FiChevronDown size={16} className={`transition-transform ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isMegaMenuOpen && <MegaMenu categories={categories} />}
              </div>

              <Link to="/" className="px-4 py-2 text-secondary-700 hover:text-accent font-medium transition-colors">
                Home
              </Link>
              <Link to="/products" className="px-4 py-2 text-secondary-700 hover:text-accent font-medium transition-colors">
                All Products
              </Link>
              <Link to="/products?featured=true" className="px-4 py-2 text-secondary-700 hover:text-accent font-medium transition-colors">
                Featured
              </Link>
              <Link to="/products?sort=bestselling" className="px-4 py-2 text-secondary-700 hover:text-accent font-medium transition-colors">
                Best Sellers
              </Link>
              <Link to="/products?deals=true" className="px-4 py-2 text-red-600 hover:text-red-700 font-medium transition-colors">
                🔥 Deals
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[120px] bg-white z-40 overflow-y-auto overflow-x-hidden animate-slide-down">
          <nav className="container-custom py-4">
            <Link
              to="/"
              className="block py-3 text-lg font-medium border-b border-secondary-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/products"
              className="block py-3 text-lg font-medium border-b border-secondary-100"
              onClick={() => setIsMenuOpen(false)}
            >
              All Products
            </Link>
            
            <div className="py-3 border-b border-secondary-100">
              <p className="text-sm text-secondary-500 mb-2">Categories</p>
              {categories.map((category) => (
                <Link
                  key={category._id}
                  to={`/category/${category.slug}`}
                  className="block py-2 text-secondary-700 hover:text-accent"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>

            {!isAuthenticated && (
              <div className="py-4 flex gap-3">
                <Link
                  to="/login"
                  className="flex-1 btn-primary text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex-1 btn-outline text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

