'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import LoadingSpinner from '@/components/LoadinSpinner';
import { 
  ShoppingCart, 
  ArrowLeft, 
  User, 
  Tag, 
  Calendar,
  Star,
  Heart,
  Share2
} from 'lucide-react';

export default function ProductDetailPage() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [user, setUser] = useState(null);
  
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data.product);
      } else {
        router.push('/products');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      router.push('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    setAddingToCart(true);

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1
        })
      });

      if (response.ok) {
        alert('Product added to cart!');
        // Optionally redirect to cart or update cart count
        router.push('/cart');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Product URL copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="xl" text="Loading product..." />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <Link
              href="/products"
              className="bg-gradient-to-r from-orange-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-purple-700 transition-all"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = user && user.id === product.seller._id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <Link
          href="/products"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-orange-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Products</span>
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            {/* Product Image */}
            <div className="relative">
              <img
                src={product.image || 'https://via.placeholder.com/600x600?text=No+Image'}
                alt={product.title}
                className="w-full h-96 lg:h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {product.category}
              </div>
            </div>

            {/* Product Details */}
            <div className="p-8">
              {/* Title and Price */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-4xl font-bold text-orange-600">${product.price}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    product.status === 'active' ? 'bg-green-100 text-green-800' :
                    product.status === 'sold' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {product.status}
                  </span>
                </div>
              </div>

              {/* Seller Info */}
              <div className="flex items-center space-x-3 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="bg-gradient-to-r from-orange-500 to-purple-600 p-2 rounded-full">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Sold by</p>
                  <p className="text-orange-600">{product.seller.username}</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Product Info */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Tag className="h-5 w-5" />
                  <span>Category: {product.category}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="h-5 w-5" />
                  <span>Listed: {new Date(product.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {isOwner ? (
                  <div className="flex gap-4 w-full">
                    <Link
                      href={`/products/edit/${product._id}`}
                      className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors text-center font-semibold"
                    >
                      Edit Product
                    </Link>
                    <button
                      onClick={handleShare}
                      className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                ) : product.status === 'active' ? (
                  <div className="flex gap-4 w-full">
                    <button
                      onClick={handleAddToCart}
                      disabled={addingToCart}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-purple-700 transition-all font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {addingToCart ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Adding...</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-5 w-5" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleShare}
                      className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-4 w-full">
                    <button
                      disabled
                      className="flex-1 bg-gray-400 text-white px-6 py-3 rounded-lg cursor-not-allowed font-semibold"
                    >
                      Not Available
                    </button>
                    <button
                      onClick={handleShare}
                      className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Additional Info */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Product ID:</span>
                    <br />
                    {product._id.slice(-8)}
                  </div>
                  <div>
                    <span className="font-medium">Last Updated:</span>
                    <br />
                    {new Date(product.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}