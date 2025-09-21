import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/context/CartContext';

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    // Load products
    fetch('/products.json')
      .then(response => response.json())
      .then((data: Product[]) => setProducts(data));

    // Check for category filter in URL
    const categoryParam = searchParams.get('category');
    if (categoryParam && ['noodles', 'sauces'].includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // Update URL params
    if (category === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  const categories = [
    { key: 'all', label: 'All Products', count: products.length },
    { key: 'noodles', label: 'Noodles', count: products.filter(p => p.category === 'noodles').length },
    { key: 'sauces', label: 'Sauces', count: products.filter(p => p.category === 'sauces').length },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div 
        className="text-white py-16 relative"
        style={{
          backgroundImage: 'url("/Our_Products.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
            Our Products
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto animate-slide-up">
            Discover our complete collection of premium noodles and authentic sauces
          </p>
        </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-6 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background border-border"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Filter by:</span>
            </div>
            {categories.map((category) => (
              <Button
                key={category.key}
                variant={selectedCategory === category.key ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange(category.key)}
                className="transition-all duration-200"
              >
                {category.label}
                <span className="ml-2 text-xs opacity-70">({category.count})</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} products
            {searchQuery && (
              <span> for "{searchQuery}"</span>
            )}
            {selectedCategory !== 'all' && (
              <span> in {categories.find(c => c.key === selectedCategory)?.label}</span>
            )}
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                style={{ animationDelay: `${index * 0.1}s` }}
                className="animate-fade-in"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mb-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">No products found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filter criteria
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSearchParams({});
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;