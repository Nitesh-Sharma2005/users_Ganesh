import { Link } from 'react-router-dom';
import { PRODUCTS, CATEGORIES, OFFERS } from '../data/mockData';
import { ProductCard } from '../components/ProductCard';
import { PlayCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';

const CategoryHighlightBox = ({ title, category, products, colorClass, borderColorClass }: { 
  title: string, 
  category: string, 
  products: typeof PRODUCTS, 
  colorClass: string,
  borderColorClass: string
}) => {
  const { setSelectedCategory } = useStore();
  const categoryProducts = products.filter(p => p.category === category).slice(0, 4);
  
  if (categoryProducts.length === 0) return null;

  return (
    <section className="px-4 md:px-0 mb-8">
      <div className={cn(
        "rounded-[2.5rem] p-6 border-[8px] transition-all",
        colorClass,
        borderColorClass
      )}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h2>
          <button 
            onClick={() => setSelectedCategory(category)}
            className="text-sm font-semibold text-gray-700 hover:text-emerald-700 hover:scale-105 transition-all"
          >
            View All
          </button>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl p-3 shadow-sm hover:shadow-md transition-shadow">
              <Link to={`/product/${product.id}`} className="block">
                <div className="aspect-square bg-gray-50 rounded-xl mb-3 flex items-center justify-center p-4 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-contain mix-blend-multiply transition-transform hover:scale-105"
                  />
                </div>
                <h3 className="text-sm font-medium text-gray-800 line-clamp-1 mb-1">{product.name}</h3>
                <p className="text-xs font-bold text-emerald-700">From ₹{product.price}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export function Home() {
  const { selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } = useStore();
  
  const filteredProducts = PRODUCTS.filter(p => {
    let match = true;
    if (selectedCategory) {
      match = match && p.category === selectedCategory;
    }
    if (searchQuery) {
      match = match && (p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return match;
  });

  const featuredProducts = PRODUCTS.filter(p => p.isFeatured);

  // Track products shown in category highlights to avoid repetition
  const highlightedCategories = [
    "Cold Drinks", "Dairy", "Snacks & Namkeen", "Bread & Bakery", 
    "Instant Foods", "Rice & Atta", "Spices", "Household"
  ];

  const highlightedProductIds = new Set(
    highlightedCategories.flatMap(cat => 
      PRODUCTS.filter(p => p.category === cat).slice(0, 4).map(p => p.id)
    )
  );

  const nonHighlightedFeaturedProducts = featuredProducts.filter(p => !highlightedProductIds.has(p.id));
  const nonHighlightedFilteredProducts = filteredProducts.filter(p => !highlightedProductIds.has(p.id));

  if (searchQuery) {
    return (
      <div className="space-y-6 md:space-y-10 py-4 md:py-8">
        <section className="px-4 md:px-0">
          <div className="flex items-center justify-between mb-4 bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/50 transition-colors">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                Search Results for "{searchQuery}"
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Found {filteredProducts.length} items</p>
            </div>
            <button 
              onClick={() => setSearchQuery('')}
              className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-gray-700 shadow-sm transition-colors"
            >
              Clear Search
            </button>
          </div>
          {filteredProducts.length === 0 ? (
            <div className="py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 text-center transition-colors">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No products found</h3>
              <p className="text-gray-500 dark:text-gray-400">We couldn't find anything matching "{searchQuery}".</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-10 py-4 md:py-8">
      {/* Search Header for active category */}
      {selectedCategory && (
        <div className="px-4 md:px-0">
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 rounded-xl p-4 flex items-center justify-between transition-colors">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Category: {selectedCategory}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Showing {filteredProducts.length} items</p>
            </div>
            <button 
              onClick={() => setSelectedCategory(null)}
              className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-gray-700 shadow-sm transition-colors"
            >
              Clear Filter
            </button>
          </div>
        </div>
      )}

      {/* Offers Section */}
      {!selectedCategory && (
        <section className="px-4 md:px-0">
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
            {OFFERS.map((offer) => (
              <div 
                key={offer.id} 
                className={`${offer.color} dark:bg-opacity-20 min-w-[280px] md:min-w-[320px] rounded-2xl p-6 flex flex-col justify-center snap-center shadow-sm relative overflow-hidden`}
              >
                <span className="text-4xl absolute right-4 bottom-4 opacity-50">{offer.image}</span>
                <h3 className="text-xl font-bold mb-1 dark:text-gray-900">{offer.title}</h3>
                <p className="text-sm opacity-90 mb-4 dark:text-gray-800">{offer.description}</p>
                <div className="inline-block bg-white/50 dark:bg-black/10 backdrop-blur-sm px-3 py-1.5 rounded border border-white/50 dark:border-black/10 text-sm font-bold w-fit z-10 dark:text-gray-900">
                  Code: {offer.code}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Video Promo Section */}
      {!selectedCategory && (
        <section className="px-4 md:px-0">
          <div className="relative rounded-2xl overflow-hidden aspect-video md:aspect-[3/1] bg-gray-900 group shadow-md border border-[#E5E7EB] dark:border-gray-700 cursor-pointer transition-colors">
            <img
              src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&q=80&w=1200&h=675"
              alt="Store Promo"
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center">
              <button className="w-16 h-16 md:w-20 md:h-20 bg-emerald-600/90 hover:bg-emerald-500 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 transition-all group-hover:scale-110 shadow-lg cursor-pointer">
                <PlayCircle size={36} className="text-white ml-1 md:w-12 md:h-12" />
              </button>
              <h2 className="text-xl md:text-3xl font-bold mb-2 text-white drop-shadow-md">Fresh Daily Delivered</h2>
              <p className="text-sm md:text-base text-gray-100 max-w-md drop-shadow-md">Take a quick tour of our local store and see our fresh products.</p>
            </div>
          </div>
        </section>
      )}

      {/* Category Wise Highlights */}
      {!selectedCategory && !searchQuery && (
        <>
          <CategoryHighlightBox 
            title="Popular picks" 
            category="Cold Drinks" 
            products={PRODUCTS} 
            colorClass="bg-emerald-50 dark:bg-emerald-950/20"
            borderColorClass="border-emerald-100 dark:border-emerald-900/30"
          />
          
          <CategoryHighlightBox 
            title="Daily Essentials" 
            category="Dairy" 
            products={PRODUCTS} 
            colorClass="bg-blue-50 dark:bg-blue-950/20"
            borderColorClass="border-blue-100 dark:border-blue-900/30"
          />

          <CategoryHighlightBox 
            title="Snacks & Munchies" 
            category="Snacks & Namkeen" 
            products={PRODUCTS} 
            colorClass="bg-orange-50 dark:bg-orange-950/20"
            borderColorClass="border-orange-100 dark:border-orange-900/30"
          />

          <CategoryHighlightBox 
            title="Morning Bakery" 
            category="Bread & Bakery" 
            products={PRODUCTS} 
            colorClass="bg-purple-50 dark:bg-purple-950/20"
            borderColorClass="border-purple-100 dark:border-purple-900/30"
          />

          <CategoryHighlightBox 
            title="Quick Meals" 
            category="Instant Foods" 
            products={PRODUCTS} 
            colorClass="bg-rose-50 dark:bg-rose-950/20"
            borderColorClass="border-rose-100 dark:border-rose-900/30"
          />

          <CategoryHighlightBox 
            title="Kitchen Staples" 
            category="Rice & Atta" 
            products={PRODUCTS} 
            colorClass="bg-yellow-50 dark:bg-yellow-950/20"
            borderColorClass="border-yellow-100 dark:border-yellow-900/30"
          />

          <CategoryHighlightBox 
            title="Spicy Delights" 
            category="Spices" 
            products={PRODUCTS} 
            colorClass="bg-red-50 dark:bg-red-950/20"
            borderColorClass="border-red-100 dark:border-red-900/30"
          />

          <CategoryHighlightBox 
            title="Household Care" 
            category="Household" 
            products={PRODUCTS} 
            colorClass="bg-indigo-50 dark:bg-indigo-950/20"
            borderColorClass="border-indigo-100 dark:border-indigo-900/30"
          />
        </>
      )}

      {/* Featured Products */}
      {!selectedCategory && nonHighlightedFeaturedProducts.length > 0 && (
        <section className="px-4 md:px-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white transition-colors">Featured Products</h2>
            <button className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">View All</button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {nonHighlightedFeaturedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* All Products */}
      <section className="px-4 md:px-0">
        <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
          {selectedCategory ? `${selectedCategory} Products` : 'All Products'}
        </h2>
        
        {(!selectedCategory ? nonHighlightedFilteredProducts : filteredProducts).length === 0 ? (
          <div className="py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 text-center transition-colors">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No products found</h3>
            <p className="text-gray-500 dark:text-gray-400">We don't have any products in this category yet.</p>
            <button 
              onClick={() => setSelectedCategory(null)}
              className="mt-6 text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
            >
              Browse all products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {(!selectedCategory ? nonHighlightedFilteredProducts : filteredProducts).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
