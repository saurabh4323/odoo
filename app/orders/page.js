'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import LoadingSpinner from '@/components/LoadinSpinner';
import { 
  Package, 
  Calendar, 
  DollarSign, 
  Eye, 
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  ArrowLeft,
  Receipt
} from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        router.push('/auth/login');
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOrderStatus = (createdAt) => {
    const orderDate = new Date(createdAt);
    const now = new Date();
    const diffHours = (now - orderDate) / (1000 * 60 * 60);
    
    if (diffHours < 1) {
      return { status: 'Processing', icon: Clock, color: 'text-yellow-600 bg-yellow-100' };
    } else if (diffHours < 24) {
      return { status: 'Confirmed', icon: CheckCircle, color: 'text-green-600 bg-green-100' };
    } else {
      return { status: 'Shipped', icon: Truck, color: 'text-blue-600 bg-blue-100' };
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const closeOrderDetails = () => {
    setShowOrderDetails(false);
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="xl" text="Loading your orders..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-2">
            <Package className="h-8 w-8 text-gray-900" />
            <h1 className="text-4xl font-bold text-gray-900">My Orders</h1>
          </div>
          <p className="text-gray-600">
            Track and manage your order history
          </p>
        </div>

        {orders.length === 0 ? (
          /* Empty Orders */
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Package className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-600 mb-4">No Orders Yet</h2>
            <p className="text-gray-500 mb-8">You have not placed any orders yet. Start shopping to see your orders here!</p>
            <Link
              href="/products"
              className="bg-gradient-to-r from-orange-500 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-orange-600 hover:to-purple-700 transition-all inline-flex items-center space-x-2"
            >
              <ShoppingBag className="h-5 w-5" />
              <span>Start Shopping</span>
            </Link>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-6">
            {orders.map((order) => {
              const orderStatus = getOrderStatus(order.createdAt);
              const StatusIcon = orderStatus.icon;
              
              return (
                <div key={order._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Order Header */}
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="text-sm text-gray-500">Order ID</p>
                          <p className="font-mono text-sm font-medium text-gray-900">
                            #{order._id.slice(-8).toUpperCase()}
                          </p>
                        </div>
                        <div className="h-8 w-px bg-gray-300"></div>
                        <div>
                          <p className="text-sm text-gray-500">Order Date</p>
                          <p className="text-sm font-medium text-gray-900">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${orderStatus.color}`}>
                          <StatusIcon className="h-4 w-4" />
                          <span className="text-sm font-medium">{orderStatus.status}</span>
                        </div>
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-medium"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View Details</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Order Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Receipt className="h-5 w-5 text-gray-400" />
                        <span className="text-lg font-semibold text-gray-900">
                          ${order.totalAmount?.toFixed(2) || '0.00'}
                        </span>
                        <span className="text-gray-500">
                          ({order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''})
                        </span>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {order.items?.slice(0, 4).map((item, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <img
                            src={item.product?.image || 'https://via.placeholder.com/40x40?text=No+Image'}
                            alt={item.title}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {item.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              Qty: {item.quantity} × ${item.price}
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.items?.length > 4 && (
                        <div className="flex items-center justify-center p-3 bg-gray-100 rounded-lg">
                          <p className="text-sm text-gray-600">
                            +{order.items.length - 4} more items
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Back to Shop Link */}
        {orders.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              href="/products"
              className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-medium"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                <p className="text-sm text-gray-500">
                  Order #{selectedOrder._id.slice(-8).toUpperCase()}
                </p>
              </div>
              <button
                onClick={closeOrderDetails}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Order Info */}
              <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Order Date</span>
                  </div>
                  <p className="text-sm text-gray-900">{formatDate(selectedOrder.createdAt)}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Total Amount</span>
                  </div>
                  <p className="text-lg font-bold text-orange-600">
                    ${selectedOrder.totalAmount?.toFixed(2) || '0.00'}
                  </p>
                </div>
              </div>

              {/* Order Status */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Order Status</h3>
                <div className="flex items-center space-x-4">
                  {(() => {
                    const status = getOrderStatus(selectedOrder.createdAt);
                    const StatusIcon = status.icon;
                    return (
                      <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${status.color}`}>
                        <StatusIcon className="h-5 w-5" />
                        <span className="font-medium">{status.status}</span>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Order Items ({selectedOrder.items?.length || 0})
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                      <img
                        src={item.product?.image || 'https://via.placeholder.com/60x60?text=No+Image'}
                        alt={item.title}
                        className="w-15 h-15 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm text-gray-500">
                          Price: ${item.price} each
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-orange-600">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={closeOrderDetails}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}