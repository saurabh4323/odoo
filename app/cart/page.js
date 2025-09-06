'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import LoadingSpinner from '@/components/LoadinSpinner';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight,
  ShoppingBag,
  CreditCard,
  Truck
} from 'lucide-react';

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState({});
  const [placingOrder, setPlacingOrder] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.cart);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    setUpdatingItems(prev => ({ ...prev, [productId]: true }));

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId,
          quantity: newQuantity
        })
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.cart);
      } else {
        alert('Failed to update cart');
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      alert('Failed to update cart');
    } finally {
      setUpdatingItems(prev => ({ ...prev, [productId]: false }));
    }
  };

  const removeItem = async (productId) => {
    if (!confirm('Remove this item from cart?')) return;

    setUpdatingItems(prev => ({ ...prev, [productId]: true }));

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId,
          quantity: 0
        })
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.cart);
      } else {
        alert('Failed to remove item');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item');
    } finally {
      setUpdatingItems(prev => ({ ...prev, [productId]: false }));
    }
  };

  const clearCart = async () => {
    if (!confirm('Clear entire cart?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setCart({ items: [], totalAmount: 0 });
      } else {
        alert('Failed to clear cart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert('Failed to clear cart');
    }
  };

  const placeOrder = async () => {
    setPlacingOrder(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Order placed successfully!');
        router.push('/orders');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  // Calculate totals
  const subtotal = cart?.items?.reduce((total, item) => 
    total + (item.product.price * item.quantity), 0) || 0;
  const shipping = subtotal > 50 ? 0 : 8.99; // Free shipping over $50
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="xl" text="Loading your cart..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center space-x-2">
            <ShoppingCart className="h-8 w-8" />
            <span>Shopping Cart</span>
          </h1>
          <p className="text-gray-600">
            {cart?.items?.length || 0} item{(cart?.items?.length || 0) !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        {!cart || cart.items.length === 0 ? (
          /* Empty Cart */
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <ShoppingCart className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-600 mb-4">Your Cart is Empty</h2>
            <p className="text-gray-500 mb-8">Add some eco-friendly products to get started!</p>
            <Link
              href="/products"
              className="bg-gradient-to-r from-orange-500 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-orange-600 hover:to-purple-700 transition-all inline-flex items-center space-x-2"
            >
              <ShoppingBag className="h-5 w-5" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Cart Items</h2>
                  {cart.items.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Clear Cart
                    </button>
                  )}
                </div>

                {/* Items */}
                <div className="divide-y divide-gray-200">
                  {cart.items.map((item) => (
                    <div key={item.product._id} className="p-6">
                      <div className="flex items-start space-x-4">
                        {/* Product Image */}
                        <Link href={`/products/${item.product._id}`}>
                          <img
                            src={item.product.image || 'https://via.placeholder.com/80x80?text=No+Image'}
                            alt={item.product.title}
                            className="w-20 h-20 object-cover rounded-lg hover:opacity-75 transition-opacity"
                          />
                        </Link>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${item.product._id}`}
                            className="text-lg font-medium text-gray-900 hover:text-orange-600 transition-colors"
                          >
                            {item.product.title}
                          </Link>
                          <p className="text-gray-600 mt-1">${item.product.price} each</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Status: {item.product.status}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateQuantity(item.product._id, Math.max(1, item.quantity - 1))}
                            disabled={updatingItems[item.product._id] || item.quantity <= 1}
                            className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          
                          <span className="font-medium text-lg min-w-[2rem] text-center">
                            {updatingItems[item.product._id] ? '...' : item.quantity}
                          </span>
                          
                          <button
                            onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                            disabled={updatingItems[item.product._id]}
                            className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <p className="text-lg font-bold text-orange-600">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                          <button
                            onClick={() => removeItem(item.product._id)}
                            disabled={updatingItems[item.product._id]}
                            className="text-red-600 hover:text-red-700 mt-2 disabled:opacity-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Continue Shopping */}
                <div className="px-6 py-4 border-t border-gray-200">
                  <Link
                    href="/products"
                    className="text-orange-600 hover:text-orange-700 font-medium inline-flex items-center space-x-2"
                  >
                    <ArrowRight className="h-4 w-4 rotate-180" />
                    <span>Continue Shopping</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="mt-8 lg:mt-0">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cart.items.length} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span className="flex items-center space-x-1">
                      <Truck className="h-4 w-4" />
                      <span>Shipping</span>
                    </span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600 font-medium">FREE</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  
                  {shipping > 0 && (
                    <p className="text-xs text-gray-500">
                      Free shipping on orders over $50
                    </p>
                  )}
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span className="text-orange-600">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={placeOrder}
                  disabled={placingOrder || cart.items.length === 0}
                  className="w-full bg-gradient-to-r from-orange-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-orange-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
                >
                  {placingOrder ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Placing Order...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5" />
                      <span>Place Order</span>
                    </>
                  )}
                </button>

                {/* Security Note */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 text-center">
                    🔒 Your payment information is secure and encrypted
                  </p>
                </div>

                {/* Promo Code Section */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Promo Code</h3>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Enter code"
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}