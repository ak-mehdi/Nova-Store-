import { Link } from 'react-router-dom';
import { 
  FiFacebook, FiTwitter, FiInstagram, FiYoutube,
  FiMail, FiPhone, FiMapPin 
} from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-secondary-900 text-white overflow-x-hidden w-full">
      {/* Newsletter Section */}
      <div className="border-b border-secondary-700">
        <div className="container-custom py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-heading font-bold mb-2">
                Subscribe to our Newsletter
              </h3>
              <p className="text-secondary-400">
                Get the latest updates on new products and upcoming sales
              </p>
            </div>
            <form className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-80 px-4 py-3 bg-secondary-800 border border-secondary-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-white placeholder-secondary-400"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-accent text-secondary-900 font-semibold rounded-lg hover:bg-accent-dark transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h2 className="text-2xl font-heading font-bold mb-4">
              <span className="text-white">Nova</span>
              <span className="text-accent">Store</span>
            </h2>
            <p className="text-secondary-400 mb-6">
              Your one-stop shop for the latest electronics and gadgets. Quality products, competitive prices, and excellent customer service.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-secondary-800 rounded-full flex items-center justify-center hover:bg-accent hover:text-secondary-900 transition-colors">
                <FiFacebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-secondary-800 rounded-full flex items-center justify-center hover:bg-accent hover:text-secondary-900 transition-colors">
                <FiTwitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-secondary-800 rounded-full flex items-center justify-center hover:bg-accent hover:text-secondary-900 transition-colors">
                <FiInstagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-secondary-800 rounded-full flex items-center justify-center hover:bg-accent hover:text-secondary-900 transition-colors">
                <FiYoutube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-secondary-400 hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-secondary-400 hover:text-accent transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?featured=true" className="text-secondary-400 hover:text-accent transition-colors">
                  Featured Products
                </Link>
              </li>
              <li>
                <Link to="/products?deals=true" className="text-secondary-400 hover:text-accent transition-colors">
                  Deals & Offers
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-secondary-400 hover:text-accent transition-colors">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/profile" className="text-secondary-400 hover:text-accent transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-secondary-400 hover:text-accent transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="text-secondary-400 hover:text-accent transition-colors">
                  Wishlist
                </Link>
              </li>
              <li>
                <a href="#" className="text-secondary-400 hover:text-accent transition-colors">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-400 hover:text-accent transition-colors">
                  Returns & Refunds
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FiMapPin className="text-accent mt-1" size={18} />
                <span className="text-secondary-400">
                  123 Electronics Street, Tech City, TC 12345
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="text-accent" size={18} />
                <a href="tel:+1234567890" className="text-secondary-400 hover:text-accent transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-accent" size={18} />
                <a href="mailto:support@novastore.com" className="text-secondary-400 hover:text-accent transition-colors">
                  support@novastore.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-secondary-700">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-secondary-400 text-sm">
              © {new Date().getFullYear()} NovaStore. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" alt="Visa" className="h-6 object-contain opacity-60" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6 object-contain opacity-60" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/200px-PayPal.svg.png" alt="PayPal" className="h-6 object-contain opacity-60" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/200px-Stripe_Logo%2C_revised_2016.svg.png" alt="Stripe" className="h-6 object-contain opacity-60" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

