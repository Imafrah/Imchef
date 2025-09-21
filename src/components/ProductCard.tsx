import { Product } from '@/context/CartContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: 'Added to cart!',
      description: `${product.name} has been added to your cart.`,
    });
  };

  const borderClass =
    product.category === 'noodles'
      ? 'border-primary/40 hover:border-primary'
      : 'border-food-warm/40 hover:border-food-warm';

  return (
    <Card className={`group bg-gradient-card border ${borderClass} hover:shadow-medium transition-all duration-300 animate-fade-in overflow-hidden`}>
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              if (img.src.endsWith('/placeholder.svg')) return;
              img.src = '/placeholder.svg';
            }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-3">
          {/* Category Badge */}
          <div className="flex items-center justify-between">
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
              product.category === 'noodles'
                ? 'bg-primary/10 text-primary'
                : 'bg-food-warm/10 text-food-warm'
            }`}>
              {product.category === 'noodles' ? 'Noodles' : 'Sauces'}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors duration-200">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>

          {/* Price and Add to Cart */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-2xl font-bold text-primary">
              ₹{product.price.toFixed(2)}
            </span>
            
            <Button 
              onClick={handleAddToCart}
              size="sm"
              className="group/btn bg-gradient-warm hover:shadow-soft transition-all duration-200"
            >
              <ShoppingCart className="h-4 w-4 mr-2 group-hover/btn:animate-zoom-in" />
              Add to Cart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;