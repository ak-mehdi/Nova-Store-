import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import ProductCard from './ProductCard';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ProductCarousel = ({ products, title, subtitle, viewAllLink, showHeader = true }) => {
  if (!products || products.length === 0) return null;

  return (
    <div className="relative">
      {/* Header - Optional */}
      {showHeader && title && (
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-secondary-900">
              {title}
            </h2>
            {subtitle && (
              <p className="text-secondary-500 mt-1">{subtitle}</p>
            )}
          </div>
          {viewAllLink && (
            <a
              href={viewAllLink}
              className="text-accent hover:text-accent-dark font-medium transition-colors hidden md:block"
            >
              View All →
            </a>
          )}
        </div>
      )}

      {/* Carousel */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={24}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true, dynamicBullets: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        loop={products.length > 4}
        breakpoints={{
          480: { slidesPerView: 2, spaceBetween: 16 },
          768: { slidesPerView: 3, spaceBetween: 20 },
          1024: { slidesPerView: 4, spaceBetween: 24 },
          1280: { slidesPerView: 5, spaceBetween: 24 },
        }}
        className="pb-12 product-carousel"
      >
        {products.map((product) => (
          <SwiperSlide key={product._id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductCarousel;

