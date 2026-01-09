import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const CategoryCard = ({ category, variant = 'default' }) => {
  // Default variant - grid card with icon
  if (variant === 'default' || variant === 'icon') {
    return (
      <Link
        to={`/category/${category.slug}`}
        className="group bg-white rounded-xl p-6 text-center shadow-card hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1"
      >
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-accent/20 to-accent/10 rounded-full flex items-center justify-center group-hover:from-accent/30 group-hover:to-accent/20 transition-all">
          {category.image ? (
            <img 
              src={category.image} 
              alt={category.name}
              className="w-10 h-10 object-contain"
            />
          ) : (
            <span className="text-2xl">📱</span>
          )}
        </div>
        <h3 className="font-semibold text-secondary-900 group-hover:text-accent transition-colors mb-1">
          {category.name}
        </h3>
        {category.productCount !== undefined && (
          <p className="text-xs text-secondary-500">
            {category.productCount} Products
          </p>
        )}
      </Link>
    );
  }

  // Banner variant - large image with overlay
  if (variant === 'banner') {
    return (
      <Link
        to={`/category/${category.slug}`}
        className="group relative block rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
      >
        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-secondary-100 to-secondary-200">
          {category.image && (
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/80 via-secondary-900/40 to-transparent" />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-2xl font-heading font-bold mb-2 group-hover:text-accent transition-colors">
            {category.name}
          </h3>
          {category.description && (
            <p className="text-secondary-200 text-sm mb-3 line-clamp-2">
              {category.description}
            </p>
          )}
          <div className="flex items-center gap-2 text-accent font-semibold">
            <span>Shop Now</span>
            <FiArrowRight className="transition-transform group-hover:translate-x-2" />
          </div>
        </div>
      </Link>
    );
  }

  // Wide variant - horizontal layout with large image
  if (variant === 'wide') {
    return (
      <Link
        to={`/category/${category.slug}`}
        className="group relative block rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
      >
        <div className="relative h-48 md:h-64 overflow-hidden bg-gradient-to-br from-secondary-100 to-secondary-200">
          {category.image && (
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/90 via-secondary-900/60 to-transparent" />
        </div>
        
        <div className="absolute inset-0 flex items-center">
          <div className="px-8 py-6 max-w-lg">
            <span className="inline-block px-3 py-1 bg-accent/90 text-secondary-900 rounded-full text-xs font-bold mb-3">
              FEATURED CATEGORY
            </span>
            <h3 className="text-3xl md:text-4xl font-heading font-bold text-white mb-3 group-hover:text-accent transition-colors">
              {category.name}
            </h3>
            {category.description && (
              <p className="text-secondary-200 mb-4 line-clamp-2">
                {category.description}
              </p>
            )}
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white text-secondary-900 rounded-lg font-semibold hover:bg-accent transition-colors">
              <span>Explore Collection</span>
              <FiArrowRight />
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Compact variant - small card
  if (variant === 'compact') {
    return (
      <Link
        to={`/category/${category.slug}`}
        className="group flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
      >
        <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
          {category.image ? (
            <img 
              src={category.image} 
              alt={category.name}
              className="w-8 h-8 object-contain"
            />
          ) : (
            <span className="text-xl">📱</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-secondary-900 group-hover:text-accent transition-colors truncate">
            {category.name}
          </h3>
          {category.productCount !== undefined && (
            <p className="text-xs text-secondary-500">
              {category.productCount} items
            </p>
          )}
        </div>
        <FiArrowRight className="text-secondary-400 group-hover:text-accent transition-colors" />
      </Link>
    );
  }

  return null;
};

export default CategoryCard;

