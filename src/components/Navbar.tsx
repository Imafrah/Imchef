import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { state } = useCart();
  const location = useLocation();
  const { user, signOutUser } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/products' },
    { name: 'Cart', path: '/cart' },
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-border">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/chef-logo.png" 
              alt="Imchef Logo" 
              className="w-12 h-12 rounded-lg object-cover"
            />
            <span className="font-bold text-xl text-foreground">Imchef</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative font-medium transition-colors duration-200 ${
                  isActivePath(link.path)
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.name}
                {isActivePath(link.path) && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* CTAs, Cart and Mobile Menu */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              {user ? (
                <>
                  <span className="text-sm text-muted-foreground mr-1">{user.displayName || user.email}</span>
                  <Button variant="outline" size="sm" onClick={signOutUser}>Sign Out</Button>
                </>
              ) : (
                <Link to="/auth">
                  <Button size="sm">Sign Up</Button>
                </Link>
              )}
            </div>
            {/* Cart Icon */}
            <Link to="/cart">
              <Button variant="outline" size="sm" className="relative">
                <ShoppingCart className="h-4 w-4" />
                {state.itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-food-warm text-food-warm-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {state.itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-3 py-2 rounded-md transition-colors duration-200 ${
                    isActivePath(link.path)
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex items-center gap-2 pt-2">
                {user ? (
                  <Button variant="outline" className="w-full" onClick={signOutUser}>Sign Out</Button>
                ) : (
                  <Link to="/auth" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;