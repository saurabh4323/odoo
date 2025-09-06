'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Leaf, 
  User, 
  ShoppingCart, 
  Search, 
  Menu, 
  X,
  LogOut,
  Package,
  Plus
} from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      fetchCartCount();
    }
  }, []);

  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const count = data.cart.items.reduce((total, item) => total + item.quantity, 0);
        setCartCount(count);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCartCount(0);
    router.push('/');
  };

  const isAuthPage = pathname?.startsWith('/auth');

  return (
    <header className="bg-white shadow-lg border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-orange-500 to-purple-600 p-2 rounded-lg">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
              EcoFinds
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/products" 
              className="text-gray-700 hover:text-orange-500 transition-colors"
            >
              Products
            </Link>
            
            {user && (
              <>
                <Link 
                  href="/dashboard" 
                  className="text-gray-700 hover:text-orange-500 transition-colors"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/products/create" 
                  className="flex items-center space-x-1 text-gray-700 hover:text-orange-500 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Sell</span>
                </Link>
              </>
            )}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {!isAuthPage && (
              <>
                {user ? (
                  <>
                    {/* Cart */}
                    <Link 
                      href="/cart" 
                      className="relative p-2 text-gray-700 hover:text-orange-500 transition-colors"
                    >
                      <ShoppingCart className="h-6 w-6" />
                      {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {cartCount}
                        </span>
                      )}
                    </Link>

                    {/* Orders */}
                    <Link 
                      href="/orders" 
                      className="p-2 text-gray-700 hover:text-orange-500 transition-colors"
                    >
                      <Package className="h-6 w-6" />
                    </Link>

                    {/* User Menu */}
                    <div className="relative group">
                      <button className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 transition-colors">
                        <User className="h-6 w-6" />
                        <span className="hidden sm:block">{user.username}</span>
                      </button>
                      
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="py-1">
                          <Link 
                            href="/dashboard" 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
                          >
                            Dashboard
                          </Link>
                          <button 
                            onClick={handleLogout}
                            className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
                          >
                            <LogOut className="h-4 w-4" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/auth/login" 
                      className="text-gray-700 hover:text-orange-500 transition-colors"
                    >
                      Login
                    </Link>
                    <Link 
                      href="/auth/register" 
                      className="bg-gradient-to-r from-orange-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-purple-700 transition-all"
                    >
                      Register
                    </Link>
                  </>
                )}
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/products" 
                className="text-gray-700 hover:text-orange-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              
              {user ? (
                <>
                  <Link 
                    href="/dashboard" 
                    className="text-gray-700 hover:text-orange-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/products/create" 
                    className="text-gray-700 hover:text-orange-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sell Product
                  </Link>
                  <Link 
                    href="/cart" 
                    className="text-gray-700 hover:text-orange-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Cart ({cartCount})
                  </Link>
                  <Link 
                    href="/orders" 
                    className="text-gray-700 hover:text-orange-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-left text-gray-700 hover:text-orange-500 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                !isAuthPage && (
                  <>
                    <Link 
                      href="/auth/login" 
                      className="text-gray-700 hover:text-orange-500 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link 
                      href="/auth/register" 
                      className="text-gray-700 hover:text-orange-500 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                )
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}