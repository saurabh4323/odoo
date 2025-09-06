'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadinSpinner';
import { 
  User, 
  Package, 
  Plus, 
  Edit,
  Save,
  X,
  ShoppingBag,
  TrendingUp,
  Eye,
  DollarSign
} from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [myProducts, setMyProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    email: ''
  });
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setProfileData({
        username: parsedUser.username,
        email: parsedUser.email
      });
    }

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch user's products
      const productsResponse = await fetch('/api/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        const userProducts = productsData.products.filter(
          product => product.seller._id === JSON.parse(localStorage.getItem('user')).id
        );
        setMyProducts(userProducts);
        
        // Calculate stats
        setStats(prev => ({
          ...prev,
          totalProducts: userProducts.length,
          totalRevenue: userProducts.reduce((sum, product) => sum + product.price, 0)
        }));
      }

      // Fetch user's orders
      const ordersResponse = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        setOrders(ordersData.orders);
        setStats(prev => ({
          ...prev,
          totalOrders: ordersData.orders.length
        }));
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        setEditingProfile(false);
        alert('Profile updated successfully!');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleProductDelete = (productId) => {
    setMyProducts(prev => prev.filter(product => product._id !== productId));
    setStats(prev => ({
      ...prev,
      totalProducts: prev.totalProducts - 1
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="xl" text="Loading your dashboard..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-gray-600">Manage your products, orders, and profile from your dashboard.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Products</p>
                <p className="text-3xl font-bold text-orange-600">{stats.totalProducts}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Package className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Orders</p>
                <p className="text-3xl font-bold text-purple-600">{stats.totalOrders}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <ShoppingBag className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Product Value</p>
                <p className="text-3xl font-bold text-green-600">${stats.totalRevenue}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <User className="h-6 w-6" />
              <span>Profile Information</span>
            </h2>
            {!editingProfile && (
              <button
                onClick={() => setEditingProfile(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          {editingProfile ? (
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={profileData.username}
                    onChange={(e) => setProfileData(prev => ({...prev, username: e.target.value}))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({...prev, email: e.target.value}))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingProfile(false);
                    setProfileData({
                      username: user.username,
                      email: user.email
                    });
                  }}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-600">Username</p>
                <p className="text-lg text-gray-900">{user?.username}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Email</p>
                <p className="text-lg text-gray-900">{user?.email}</p>
              </div>
            </div>
          )}
        </div>

        {/* My Products Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <Package className="h-6 w-6" />
              <span>My Products ({myProducts.length})</span>
            </h2>
            <Link
              href="/products/add"
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Product</span>
            </Link>
          </div>

          {myProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
              <p className="text-gray-600 mb-6">Start by adding your first product to the marketplace.</p>
              <Link
                href="/products/add"
                className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors inline-flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Add Your First Product</span>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onDelete={handleProductDelete}
                  showActions={true}
                />
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <ShoppingBag className="h-6 w-6" />
              <span>Recent Orders ({orders.length})</span>
            </h2>
            {orders.length > 0 && (
              <Link
                href="/orders"
                className="text-orange-600 hover:text-orange-700 flex items-center space-x-1"
              >
                <span>View All</span>
                <Eye className="h-4 w-4" />
              </Link>
            )}
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-600">Your orders will appear here once customers start purchasing.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.product?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.buyer?.username || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${order.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          order.status === 'completed' 
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}