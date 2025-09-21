import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, Shield, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ProductCard from '@/components/ProductCard';
import StyledTypingAnimation from '@/components/StyledTypingAnimation';
import LogoMarquee from '@/components/LogoMarquee';
import { Product } from '@/context/CartContext';
// Hero video served from public folder: "/Hero_Vidio.mp4"

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Load featured products
    fetch('/products.json')
      .then(response => response.json())
      .then((products: Product[]) => {
        // Show first 4 products as featured
        setFeaturedProducts(products.slice(0, 4));
      });
  }, []);

  const features = [
    {
      icon: Star,
      title: 'Premium Quality',
      description: 'Carefully selected ingredients and traditional recipes'
    },
    {
      icon: Truck,
      title: 'Fast Shipping',
      description: 'Free delivery on orders over ₹500'
    },
    {
      icon: Shield,
      title: 'Quality Guarantee',
      description: '100% satisfaction or your money back'
    },
    {
      icon: Heart,
      title: 'Made with Love',
      description: 'Artisan crafted with passion and care'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-white">
        <div className="container mx-auto px-4 lg:px-6 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground mb-4">
              <span className="inline-block h-2 w-2 rounded-full bg-primary" />
              Backed by Premium Quality
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
              <StyledTypingAnimation 
                textParts={[
                  { text: "Streamline Cooking, ", className: "text-foreground" },
                  { text: "Maximize Flavor", className: "text-primary" }
                ]}
                speed={80}
                delay={500}
                loop={true}
                pauseTime={3000}
              />
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl">
              Take control of your kitchen with artisan noodles and sauces. Track, pair,
              and elevate every dish effortlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/products">
                <Button size="lg">Explore Our Flavors</Button>
              </Link>
              <Link to="/products">
                <Button size="lg" variant="outline">
                  See Recipes
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <video
              className="rounded-2xl shadow-strong w-full h-auto object-cover"
              src="/Hero_Vidio.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
            />
          </div>
        </div>
      </section>

      {/* Trust Logos */}
      <section className="py-10 bg-white border-y border-border">
        <div className="container mx-auto px-4 lg:px-6">
          <p className="text-center text-sm text-muted-foreground mb-6">
            Trusted by 300k+ home cooks and 12k+ restaurants
          </p>
          <LogoMarquee />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-border hover:shadow-medium transition-all duration-300 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Shop by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our carefully curated selection of premium noodles and authentic sauces
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Noodles Category */}
            <Link to="/products?category=noodles" className="group">
              <Card className="relative overflow-hidden border-border hover:shadow-strong transition-all duration-300 h-64">
                <CardContent className="p-0 relative h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center z-10">
                      <h3 className="text-2xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                        Premium Noodles
                      </h3>
                      <p className="text-muted-foreground mb-4">Artisan wheat, rice & buckwheat varieties</p>
                      <Button variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground">
                        Shop Noodles
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Sauces Category */}
            <Link to="/products?category=sauces" className="group">
              <Card className="relative overflow-hidden border-border hover:shadow-strong transition-all duration-300 h-64">
                <CardContent className="p-0 relative h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-food-warm/20 to-food-warm/5" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center z-10">
                      <h3 className="text-2xl font-bold mb-2 text-foreground group-hover:text-food-warm transition-colors">
                        Authentic Sauces
                      </h3>
                      <p className="text-muted-foreground mb-4">Traditional & modern flavor profiles</p>
                      <Button variant="outline" className="group-hover:bg-food-warm group-hover:text-food-warm-foreground">
                        Shop Sauces
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Featured Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hand-picked favorites from our premium collection
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/products">
              <Button size="lg" variant="outline" className="hover:bg-primary hover:text-primary-foreground">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;