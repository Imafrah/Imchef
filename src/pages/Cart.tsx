import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';

const Cart = () => {
  const { state, updateQuantity, removeFromCart } = useCart();
  const { toast } = useToast();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(productId);
      return;
    }
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
    toast({
      title: 'Item removed',
      description: 'Product has been removed from your cart.',
    });
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div 
          className="text-white py-16 relative"
          style={{
            backgroundImage: 'url("/Shopping_cart.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative z-10">
          <div className="container mx-auto px-4 lg:px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
              Shopping Cart
            </h1>
          </div>
          </div>
        </div>

        {/* Empty Cart */}
        <div className="container mx-auto px-4 lg:px-6 py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-foreground">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added any items to your cart yet. 
              Start shopping to fill it up!
            </p>
            <Link to="/products">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div 
        className="text-white py-16 relative"
        style={{
          backgroundImage: 'url("/Shopping_cart.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
            Shopping Cart
          </h1>
          <p className="text-xl text-white/90 animate-slide-up">
            {state.itemCount} {state.itemCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Cart Items</h2>
              <Link to="/products">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Button>
              </Link>
            </div>

            {state.items.map((item) => (
              <Card key={item.id} className="border-border hover:shadow-medium transition-all duration-200">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full sm:w-24 h-32 sm:h-24 object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="font-semibold text-lg text-foreground">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                          <span className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full ${
                            item.category === 'noodles'
                              ? 'bg-primary/10 text-primary'
                              : 'bg-food-warm/10 text-food-warm'
                          }`}>
                            {item.category === 'noodles' ? 'Noodles' : 'Sauces'}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">₹{item.price.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">each</p>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center space-x-4">
                          <span className="font-semibold text-foreground">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 border-border shadow-medium">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-foreground">Order Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal ({state.itemCount} items)</span>
                    <span className="font-medium">₹{state.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">
                      {state.total >= 500 ? 'Free' : '₹50'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">GST (18%)</span>
                    <span className="font-medium">₹{(state.total * 0.18).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">
                        ₹{(state.total + (state.total >= 500 ? 0 : 50) + state.total * 0.18).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {state.total < 500 && (
                  <div className="mb-4 p-3 bg-food-warm/10 border border-food-warm/20 rounded-lg">
                    <p className="text-sm text-food-warm">
                      Add ₹{(500 - state.total).toFixed(2)} more for free shipping!
                    </p>
                  </div>
                )}

                <Link to="/checkout" className="block">
                  <Button size="lg" className="w-full bg-gradient-warm hover:shadow-soft">
                    Proceed to Checkout
                  </Button>
                </Link>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Secure checkout powered by industry-leading encryption
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;