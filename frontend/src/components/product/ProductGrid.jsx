import ProductCard from './ProductCard';

const ProductGrid = ({ products, columns = 4, isLoading = false }) => {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
    6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6',
  };

  if (isLoading) {
    return (
      <div className={`grid ${gridCols[columns]} gap-6`}>
        {[...Array(columns * 2)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="aspect-square bg-secondary-200" />
            <div className="p-4 space-y-3">
              <div className="h-3 bg-secondary-200 rounded w-1/3" />
              <div className="h-4 bg-secondary-200 rounded" />
              <div className="h-4 bg-secondary-200 rounded w-2/3" />
              <div className="h-6 bg-secondary-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-secondary-500 text-lg">No products found</p>
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;

