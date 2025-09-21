import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram as InstagramIcon, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Shop: [
      { name: 'All Products', path: '/products' },
      { name: 'Noodles', path: '/products?category=noodles' },
      { name: 'Sauces', path: '/products?category=sauces' },
    ],
    Support: [
      { name: 'Contact Us', path: '/contact' },
      { name: 'FAQ', path: '/faq' },
      { name: 'Shipping Info', path: '/shipping' },
      { name: 'Returns', path: '/returns' },
    ],
    Company: [
      { name: 'About Us', path: '/about' },
      { name: 'Our Story', path: '/story' },
      { name: 'Careers', path: '/careers' },
      { name: 'Press', path: '/press' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: InstagramIcon, href: '#', label: 'Instagram' },
  ];

  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 lg:px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/chef-logo.png" 
                alt="Imchef Logo" 
                className="w-12 h-12 rounded-lg object-cover"
              />
              <span className="font-bold text-xl text-foreground">Imchef</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Premium artisan food and authentic sauces crafted with passion. 
              Bringing authentic flavors to your kitchen since 2020.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>imafrah03@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+91-9731595077</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Bajpe,Mangalore,Karnataka</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h3 className="font-semibold text-foreground">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center py-4">
          <p className="text-xs text-muted-foreground/70">
            This website created by Mohammed Afrah Usman
          </p>
        </div>

        {/* Bottom Footer */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <p className="text-sm text-muted-foreground">
              © {currentYear} Imchef. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-4">
              <Link
                to="/privacy"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

