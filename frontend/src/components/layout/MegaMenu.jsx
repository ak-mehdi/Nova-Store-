import { Link } from 'react-router-dom';
import { 
  FiMonitor, FiSmartphone, FiSpeaker, FiCamera, 
  FiHeadphones, FiCpu 
} from 'react-icons/fi';

const categoryIcons = {
  'laptops-computers': FiMonitor,
  'smartphones-tablets': FiSmartphone,
  'tv-audio': FiSpeaker,
  'cameras-photography': FiCamera,
  'gaming': FiCpu,
  'accessories': FiHeadphones,
};

const MegaMenu = ({ categories }) => {
  return (
    <div className="absolute top-full left-0 w-[600px] bg-white rounded-lg shadow-dropdown p-6 grid grid-cols-2 gap-4 animate-fade-in">
      {categories.map((category) => {
        const IconComponent = categoryIcons[category.slug] || FiCpu;
        
        return (
          <Link
            key={category._id}
            to={`/category/${category.slug}`}
            className="flex items-start gap-4 p-4 rounded-lg hover:bg-secondary-50 transition-colors group"
          >
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent transition-colors">
              <IconComponent size={24} className="text-accent group-hover:text-secondary-900 transition-colors" />
            </div>
            <div>
              <h3 className="font-semibold text-secondary-900 group-hover:text-accent transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-secondary-500 mt-1 line-clamp-2">
                {category.description || `Browse ${category.name} products`}
              </p>
            </div>
          </Link>
        );
      })}
      
      <Link
        to="/products"
        className="col-span-2 text-center py-3 bg-secondary-900 text-white rounded-lg font-medium hover:bg-secondary-800 transition-colors"
      >
        View All Products
      </Link>
    </div>
  );
};

export default MegaMenu;

