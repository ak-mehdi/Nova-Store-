import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useParams } from 'react-router-dom';
import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import { fetchProducts, fetchCategories, setFilters, clearFilters } from '../redux/slices/productSlice';
import ProductGrid from '../components/product/ProductGrid';

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'bestselling', label: 'Best Selling' },
];

const ProductList = () => {
  const dispatch = useDispatch();
  const { slug: categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const { products, categories, pagination, filters, isLoading } = useSelector(
    (state) => state.products
  );
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const params = {
      page: searchParams.get('page') || 1,
      category: categorySlug || searchParams.get('category') || '',
      search: searchParams.get('search') || '',
      sort: searchParams.get('sort') || 'newest',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      featured: searchParams.get('featured') || '',
      inStock: searchParams.get('inStock') || '',
    };

    dispatch(setFilters(params));
    dispatch(fetchProducts(params));
  }, [dispatch, searchParams, categorySlug]);

  const handleSortChange = (e) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', e.target.value);
    setSearchParams(newParams);
  };

  const handleCategoryFilter = (slug) => {
    const newParams = new URLSearchParams(searchParams);
    if (slug) {
      newParams.set('category', slug);
    } else {
      newParams.delete('category');
    }
    newParams.delete('page');
    setSearchParams(newParams);
  };

  const handlePriceFilter = () => {
    const newParams = new URLSearchParams(searchParams);
    if (priceRange.min) {
      newParams.set('minPrice', priceRange.min);
    } else {
      newParams.delete('minPrice');
    }
    if (priceRange.max) {
      newParams.set('maxPrice', priceRange.max);
    } else {
      newParams.delete('maxPrice');
    }
    newParams.delete('page');
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setSearchParams({});
    setPriceRange({ min: '', max: '' });
  };

  const handlePageChange = (page) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page);
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeFiltersCount = [
    filters.category,
    filters.minPrice,
    filters.maxPrice,
    filters.search,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-secondary-50 overflow-x-hidden w-full">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-secondary-900">
            {categorySlug
              ? categories.find((c) => c.slug === categorySlug)?.name || 'Category'
              : filters.search
              ? `Search results for "${filters.search}"`
              : 'All Products'}
          </h1>
          <p className="text-secondary-500 mt-2">
            {pagination.total} products found
          </p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-card p-6 sticky top-28">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-secondary-900">Filters</h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={handleClearFilters}
                    className="text-sm text-red-500 hover:text-red-600"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium text-secondary-900 mb-3">Categories</h4>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => handleCategoryFilter('')}
                      className={`w-full text-left py-1 px-2 rounded transition-colors ${
                        !filters.category
                          ? 'bg-accent text-secondary-900 font-medium'
                          : 'text-secondary-600 hover:text-accent'
                      }`}
                    >
                      All Categories
                    </button>
                  </li>
                  {categories.map((category) => (
                    <li key={category._id}>
                      <button
                        onClick={() => handleCategoryFilter(category.slug)}
                        className={`w-full text-left py-1 px-2 rounded transition-colors ${
                          filters.category === category.slug
                            ? 'bg-accent text-secondary-900 font-medium'
                            : 'text-secondary-600 hover:text-accent'
                        }`}
                      >
                        {category.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium text-secondary-900 mb-3">Price Range</h4>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <button
                  onClick={handlePriceFilter}
                  className="w-full mt-2 py-2 bg-secondary-100 text-secondary-700 rounded-lg text-sm font-medium hover:bg-secondary-200 transition-colors"
                >
                  Apply
                </button>
              </div>

              {/* Stock Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-secondary-900 mb-3">Availability</h4>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={searchParams.get('inStock') === 'true'}
                    onChange={(e) => {
                      const newParams = new URLSearchParams(searchParams);
                      if (e.target.checked) {
                        newParams.set('inStock', 'true');
                      } else {
                        newParams.delete('inStock');
                      }
                      setSearchParams(newParams);
                    }}
                    className="w-4 h-4 rounded border-secondary-300 text-accent focus:ring-accent"
                  />
                  <span className="text-secondary-600">In Stock Only</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-card"
              >
                <FiFilter />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="px-2 py-0.5 bg-accent text-secondary-900 rounded-full text-xs font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Sort */}
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-secondary-500 text-sm">Sort by:</span>
                <div className="relative">
                  <select
                    value={filters.sort}
                    onChange={handleSortChange}
                    className="appearance-none bg-white border border-secondary-200 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-secondary-400" />
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {filters.search && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary-100 rounded-full text-sm">
                    Search: {filters.search}
                    <button
                      onClick={() => {
                        const newParams = new URLSearchParams(searchParams);
                        newParams.delete('search');
                        setSearchParams(newParams);
                      }}
                    >
                      <FiX size={14} />
                    </button>
                  </span>
                )}
                {filters.category && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary-100 rounded-full text-sm">
                    {categories.find((c) => c.slug === filters.category)?.name}
                    <button onClick={() => handleCategoryFilter('')}>
                      <FiX size={14} />
                    </button>
                  </span>
                )}
                {(filters.minPrice || filters.maxPrice) && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary-100 rounded-full text-sm">
                    ${filters.minPrice || '0'} - ${filters.maxPrice || '∞'}
                    <button
                      onClick={() => {
                        const newParams = new URLSearchParams(searchParams);
                        newParams.delete('minPrice');
                        newParams.delete('maxPrice');
                        setPriceRange({ min: '', max: '' });
                        setSearchParams(newParams);
                      }}
                    >
                      <FiX size={14} />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Products Grid */}
            <ProductGrid products={products} isLoading={isLoading} />

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-secondary-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary-100"
                >
                  Previous
                </button>
                {[...Array(pagination.pages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-4 py-2 rounded-lg ${
                      pagination.page === i + 1
                        ? 'bg-accent text-secondary-900 font-medium'
                        : 'border border-secondary-200 hover:bg-secondary-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 border border-secondary-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary-100"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsFilterOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Filters</h3>
              <button onClick={() => setIsFilterOpen(false)}>
                <FiX size={24} />
              </button>
            </div>
            
            {/* Same filters as sidebar */}
            <div className="mb-6">
              <h4 className="font-medium text-secondary-900 mb-3">Categories</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => {
                      handleCategoryFilter('');
                      setIsFilterOpen(false);
                    }}
                    className={`w-full text-left py-2 ${
                      !filters.category ? 'text-accent font-medium' : 'text-secondary-600'
                    }`}
                  >
                    All Categories
                  </button>
                </li>
                {categories.map((category) => (
                  <li key={category._id}>
                    <button
                      onClick={() => {
                        handleCategoryFilter(category.slug);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left py-2 ${
                        filters.category === category.slug
                          ? 'text-accent font-medium'
                          : 'text-secondary-600'
                      }`}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={handleClearFilters}
              className="w-full py-3 border border-secondary-200 rounded-lg text-secondary-700 font-medium"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;

