import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { FiTruck, FiShield, FiHeadphones, FiCreditCard, FiArrowRight } from 'react-icons/fi';
import {
  fetchFeaturedProducts,
  fetchDealProducts,
  fetchBestsellingProducts,
  fetchCategories,
} from '../redux/slices/productSlice';
import ProductCarousel from '../components/product/ProductCarousel';
import CategoryCard from '../components/product/CategoryCard';
import { PageLoading } from '../components/common/Loading';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const heroSlides = [
  {
    id: 1,
    title: 'Next-Gen Computing',
    subtitle: 'Powerful Performance',
    description: 'Experience the future of productivity with the latest M3 MacBooks and high-end workstations.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1600&h=600&fit=crop',
    buttonText: 'Shop Laptops',
    buttonLink: '/category/laptops-computers',
  },
  {
    id: 2,
    title: 'Mobile Innovation',
    subtitle: 'Stay Connected',
    description: 'Explore the new iPhone 15 Pro and Galaxy S24 Ultra with groundbreaking AI features.',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1600&h=600&fit=crop',
    buttonText: 'View Phones',
    buttonLink: '/category/smartphones-tablets',
  },
  {
    id: 3,
    title: 'Immersive Audio',
    subtitle: 'Premium Sound',
    description: 'Lose yourself in music with industry-leading noise cancellation and spatial audio.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&h=600&fit=crop',
    buttonText: 'Discover More',
    buttonLink: '/category/accessories',
  },
];

const features = [
  {
    icon: FiTruck,
    title: 'Free Shipping',
    description: 'On orders over $100',
  },
  {
    icon: FiShield,
    title: 'Secure Payment',
    description: '100% secure transactions',
  },
  {
    icon: FiHeadphones,
    title: '24/7 Support',
    description: 'Dedicated customer service',
  },
  {
    icon: FiCreditCard,
    title: 'Easy Returns',
    description: '30-day return policy',
  },
];

const Home = () => {
  const dispatch = useDispatch();
  const {
    featuredProducts,
    dealProducts,
    bestsellingProducts,
    categories,
    isLoading,
  } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchFeaturedProducts(8));
    dispatch(fetchDealProducts(8));
    dispatch(fetchBestsellingProducts(8));
    dispatch(fetchCategories());
  }, [dispatch]);

  if (isLoading && featuredProducts.length === 0) {
    return <PageLoading />;
  }

  return (
    <div className="overflow-x-hidden w-full">
      {/* Hero Section */}
      <section className="relative">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          effect="fade"
          spaceBetween={0}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop
          className="h-[500px] md:h-[600px]"
        >
          {heroSlides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative h-full">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/80 to-transparent" />
                <div className="absolute inset-0 flex items-center">
                  <div className="container-custom">
                    <div className="max-w-xl text-white animate-fade-in">
                      <span className="inline-block px-4 py-2 bg-accent text-secondary-900 rounded-full text-sm font-semibold mb-4">
                        {slide.subtitle}
                      </span>
                      <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4">
                        {slide.title}
                      </h1>
                      <p className="text-lg md:text-xl text-secondary-200 mb-8">
                        {slide.description}
                      </p>
                      <Link
                        to={slide.buttonLink}
                        className="btn-primary text-lg"
                      >
                        {slide.buttonText}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Features */}
      <section className="py-8 bg-white border-b">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-900">{feature.title}</h3>
                  <p className="text-sm text-secondary-500">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories - Large Banners */}
      <section className="section bg-secondary-50">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-secondary-900">
                Featured Categories
              </h2>
              <p className="text-secondary-600 mt-1">
                Browse our top electronics collections
              </p>
            </div>
            <Link 
              to="/products" 
              className="hidden md:flex items-center gap-2 text-accent font-semibold hover:gap-3 transition-all"
            >
              View All
              <FiArrowRight />
            </Link>
          </div>

          {/* First 3 categories as large banners */}
          {categories.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {categories.slice(0, 3).map((category) => (
                <CategoryCard 
                  key={category._id} 
                  category={category} 
                  variant="banner"
                />
              ))}
            </div>
          )}

          {/* Remaining categories as grid */}
          {categories.length > 3 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.slice(3).map((category) => (
                <CategoryCard 
                  key={category._id} 
                  category={category} 
                  variant="icon"
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-secondary-900">
                Featured Products
              </h2>
              <p className="text-secondary-600 mt-1">
                Hand-picked products just for you
              </p>
            </div>
            <Link 
              to="/products?featured=true" 
              className="hidden md:flex items-center gap-2 text-accent font-semibold hover:gap-3 transition-all"
            >
              View All
              <FiArrowRight />
            </Link>
          </div>
          <ProductCarousel
            products={featuredProducts}
            viewAllLink="/products?featured=true"
            showHeader={false}
          />
        </div>
      </section>

      {/* Deal of the Day Banner with Image */}
      <section className="relative py-20 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 overflow-hidden w-full">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] animate-pulse"></div>
        </div>
        <div className="container-custom relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-white text-center md:text-left max-w-2xl">
              <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold mb-4 animate-bounce">
                ⚡ LIMITED TIME OFFER
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black mb-4">
                Deal of the Day
              </h2>
              <p className="text-xl md:text-2xl text-white/90 mb-2">
                Save up to <span className="text-5xl font-black">50%</span>
              </p>
              <p className="text-white/80 text-lg mb-6">
                On selected electronics. Limited quantities available!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  to="/products?deals=true"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-red-600 rounded-lg font-bold text-lg hover:bg-accent hover:text-secondary-900 transition-all transform hover:scale-105 shadow-xl"
                >
                  Shop Deals Now
                  <FiArrowRight className="text-xl" />
                </Link>
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg font-bold text-lg hover:bg-white/20 transition-all border-2 border-white/30"
                >
                  View All Products
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-white/20 rounded-full blur-2xl"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/30">
                  <div className="text-center text-white">
                    <p className="text-sm font-semibold mb-2">OFFER ENDS IN</p>
                    <div className="flex gap-4">
                      <div className="bg-white/20 rounded-lg p-4">
                        <div className="text-3xl font-black">23</div>
                        <div className="text-xs">Hours</div>
                      </div>
                      <div className="bg-white/20 rounded-lg p-4">
                        <div className="text-3xl font-black">45</div>
                        <div className="text-xs">Minutes</div>
                      </div>
                      <div className="bg-white/20 rounded-lg p-4">
                        <div className="text-3xl font-black">12</div>
                        <div className="text-xs">Seconds</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deal Products */}
      {dealProducts.length > 0 && (
        <section className="section bg-gradient-to-br from-red-50 to-orange-50">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-secondary-900 flex items-center gap-3">
                  <span className="text-4xl animate-pulse">🔥</span>
                  Hot Deals
                </h2>
                <p className="text-secondary-600 mt-1">
                  Save big on these amazing offers
                </p>
              </div>
              <Link 
                to="/products?deals=true" 
                className="hidden md:flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all"
              >
                View All Deals
                <FiArrowRight />
              </Link>
            </div>
            <ProductCarousel
              products={dealProducts}
              viewAllLink="/products?deals=true"
              showHeader={false}
            />
          </div>
        </section>
      )}

      {/* Best Sellers */}
      <section className="section bg-secondary-50">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-secondary-900 flex items-center gap-3">
                <span className="text-3xl">⭐</span>
                Best Sellers
              </h2>
              <p className="text-secondary-600 mt-1">
                Our most popular products
              </p>
            </div>
            <Link 
              to="/products?sort=bestselling" 
              className="hidden md:flex items-center gap-2 text-accent font-semibold hover:gap-3 transition-all"
            >
              View All
              <FiArrowRight />
            </Link>
          </div>
          <ProductCarousel
            products={bestsellingProducts}
            viewAllLink="/products?sort=bestselling"
            showHeader={false}
          />
        </div>
      </section>

      {/* Promotional Banners */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Banner 1 */}
            <Link 
              to="/category/gaming" 
              className="group relative block rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              <div className="relative h-64 bg-gradient-to-br from-purple-600 to-blue-600 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=400&fit=crop"
                  alt="Gaming"
                  className="w-full h-full object-cover mix-blend-overlay opacity-80 transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-transparent" />
              </div>
              <div className="absolute inset-0 flex items-center">
                <div className="px-8 py-6">
                  <span className="inline-block px-3 py-1 bg-accent rounded-full text-xs font-bold mb-3">
                    NEW ARRIVAL
                  </span>
                  <h3 className="text-3xl font-heading font-bold text-white mb-2">
                    Gaming Zone
                  </h3>
                  <p className="text-white/90 mb-4">
                    Latest consoles & accessories
                  </p>
                  <div className="inline-flex items-center gap-2 text-accent font-bold">
                    Shop Now <FiArrowRight />
                  </div>
                </div>
              </div>
            </Link>

            {/* Banner 2 */}
            <Link 
              to="/category/cameras-photography" 
              className="group relative block rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              <div className="relative h-64 bg-gradient-to-br from-orange-600 to-red-600 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=400&fit=crop"
                  alt="Cameras"
                  className="w-full h-full object-cover mix-blend-overlay opacity-80 transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-orange-900/80 to-transparent" />
              </div>
              <div className="absolute inset-0 flex items-center">
                <div className="px-8 py-6">
                  <span className="inline-block px-3 py-1 bg-accent rounded-full text-xs font-bold mb-3">
                    PRO GRADE
                  </span>
                  <h3 className="text-3xl font-heading font-bold text-white mb-2">
                    Photography
                  </h3>
                  <p className="text-white/90 mb-4">
                    Capture every moment perfectly
                  </p>
                  <div className="inline-flex items-center gap-2 text-accent font-bold">
                    Explore <FiArrowRight />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-secondary-900 to-secondary-800">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Stay Updated
          </h2>
          <p className="text-secondary-300 mb-8 max-w-xl mx-auto">
            Subscribe to our newsletter and be the first to know about new products, exclusive offers, and tech news.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-secondary-700 border border-secondary-600 text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button type="submit" className="btn-primary">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;

