'use client';

import Link from 'next/link';
import { ShoppingCart, Edit, Trash2 } from 'lucide-react';

export default function ProductCard({ product, isOwner = false, onDelete }) {
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to add items to cart');
      return;
    }

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
        // Refresh cart count in header
        window.location.reload();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/products/${product._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Product deleted successfully!');
        onDelete && onDelete(product._id);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <Link href={`/products/${product._id}`}>
        <div className="relative">
          <img
            src={product.image || 'https://via.placeholder.com/300x300?text=No+Image'}
            alt={product.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-purple-600 text-white text-xs px-2 py-1 rounded-full">
            {product.category}
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-bold text-orange-600">
              ${product.price}
            </span>
            <span className="text-sm text-gray-500">
              by {product.seller?.username || 'Unknown'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {isOwner ? (
              <>
                <Link
                  href={`/products/edit/${product._id}`}
                  className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </Link>
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-1"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-orange-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-purple-700 transition-all flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Add to Cart</span>
              </button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}