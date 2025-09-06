'use client';

import { useState, useEffect } from 'react';
import { 
  Leaf, 
  ShoppingBag, 
  Users, 
  Star,
  ArrowRight,
  Search,
  Recycle,
  Heart,
  Shield,
  Menu,
  X,
  Play,
  TrendingUp,
  Award,
  Globe,
  MessageCircle,
  MapPin,
  Clock,
  CheckCircle
} from 'lucide-react';
import Header from '@/components/Header';

export default function ClassicHomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch('/api/products?limit=6');
      if (response.ok) {
        const data = await response.json();
        setFeaturedProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
     <Header />


      {/* Hero Section */}
      <section className="pt-16 bg-gradient-to-br from-orange-50 to-white" style={{marginTop: '-60px'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-2 bg-orange-100 border border-orange-200 rounded-full px-4 py-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-orange-600 text-sm font-medium">🌍 Eco-Friendly Marketplace</span>
                </div>
                
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                  Buy & Sell
                  <br />
                  <span className="text-orange-500">Sustainable</span>
                  <br />
                  Products
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed">
                  Connect with eco-conscious people in your community. Discover sustainable products 
                  from verified sellers, or turn your eco-friendly items into income.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => window.location.href = '/products'} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors shadow-sm flex items-center justify-center space-x-3">
                  <Search className="h-5 w-5" />
                  <span>Browse Products</span>
                </button>
                <button onClick={() => window.location.href = '/products/create'} className="border border-gray-300 hover:border-orange-500 text-gray-700 hover:text-orange-600 px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-3">
                  <ShoppingBag className="h-5 w-5" />
                  <span>Start Selling</span>
                </button>
              </div>

           
            </div>

            {/* Hero Visual */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                {/* Main marketplace image */}
                <div className="relative mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=280&fit=crop" 
                    alt="Marketplace community"
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                    <div className="text-sm font-medium text-gray-900">Live Marketplace</div>
                  </div>
                  <div className="absolute top-3 right-3 bg-green-500 rounded-full px-3 py-1">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-xs text-white font-medium">ACTIVE</span>
                    </div>
                  </div>
                </div>
                
                {/* Product previews */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <img src="https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=150&h=100&fit=crop" alt="Solar charger" className="w-full h-12 object-cover rounded mb-1" />
                    <div className="text-xs font-medium text-gray-700">Solar Charger</div>
                    <div className="text-xs text-orange-500 font-bold">$45</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&h=100&fit=crop" alt="Bamboo case" className="w-full h-12 object-cover rounded mb-1" />
                    <div className="text-xs font-medium text-gray-700">Bamboo Case</div>
                    <div className="text-xs text-orange-500 font-bold">$25</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <img src="https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=150&h=100&fit=crop" alt="Water bottle" className="w-full h-12 object-cover rounded mb-1" />
                    <div className="text-xs font-medium text-gray-700">Water Bottle</div>
                    <div className="text-xs text-orange-500 font-bold">$20</div>
                  </div>
                </div>

                {/* Recent activity */}
              
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose EcoFinds?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join our trusted community of eco-conscious buyers and sellers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Recycle,
                title: "100% Eco-Focused",
                description: "Every product promotes sustainable living and environmental responsibility. Verified eco-friendly items only.",
                color: "bg-green-500"
              },
              {
                icon: Users,
                title: "Trusted Community",
                description: "Connect with verified sellers and buyers who share your values. Real people, real impact.",
                color: "bg-orange-500"
              },
              {
                icon: Shield,
                title: "Safe & Secure",
                description: "Advanced security measures, verified users, and secure payment options for peace of mind.",
                color: "bg-blue-500"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
                <div className={`w-16 h-16 ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, safe, and sustainable trading in three easy steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: Search,
                title: "Discover Products",
                description: "Browse eco-friendly products from verified sellers in your area. Use filters to find exactly what you need."
              },
              {
                step: "02",
                icon: MessageCircle,
                title: "Connect Safely",
                description: "Message sellers directly, ask questions, and arrange safe meetups. All communications are secured."
              },
              {
                step: "03",
                icon: CheckCircle,
                title: "Complete Trade",
                description: "Meet safely, complete the transaction, and leave reviews. Track your positive environmental impact."
              }
            ].map((step, index) => (
              <div key={index} className="relative text-center">
                <div className="bg-orange-50 border-2 border-orange-100 rounded-2xl p-8">
                  <div className="text-orange-500 font-bold text-sm mb-4">{step.step}</div>
                  <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-12 -right-4">
                    <ArrowRight className="h-6 w-6 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Recently Listed
              </h2>
              <p className="text-xl text-gray-600">Fresh eco-friendly products from our community</p>
            </div>
            <button className="hidden md:flex items-center space-x-2 text-orange-500 hover:text-orange-600 transition-colors font-medium">
              <span>View All Products</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.length > 0 ? featuredProducts.map((product) => (
                <div key={product._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img 
                      src={product.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop"} 
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
                      <div className="flex items-center space-x-1 text-sm">
                        <Star className="h-4 w-4 text-orange-400" />
                        <span className="text-gray-700 font-medium">{product.rating || '4.5'}</span>
                      </div>
                    </div>
                    <div className="absolute top-3 left-3 bg-orange-500 rounded-lg px-2 py-1">
                      <span className="text-xs text-white font-medium">ECO</span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                    <div className="flex items-center space-x-2 mb-4">
                      <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=24&h=24&fit=crop&crop=face" className="w-6 h-6 rounded-full" alt="Seller" />
                      <span className="text-gray-600 text-sm">by {typeof product.seller === 'object' ? product.seller?.username : product.seller || 'EcoSeller'}</span>
                      <span className="text-xs text-gray-400">• 1.2km away</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-orange-500">${product.price}</span>
                      <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                        Contact
                      </button>
                    </div>
                  </div>
                </div>
              )) : (
                [
                  {
                    _id: 'demo1',
                    name: 'Solar Power Bank 20000mAh',
                    price: 45.99,
                    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=300&fit=crop',
                    rating: 4.8,
                    seller: 'GreenTech_Mike'
                  },
                  {
                    _id: 'demo2',
                    name: 'Handcrafted Bamboo Phone Case',
                    price: 24.99,
                    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop',
                    rating: 4.9,
                    seller: 'EcoCrafts_Ana'
                  },
                  {
                    _id: 'demo3',
                    name: 'Stainless Steel Water Bottle',
                    price: 19.99,
                    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop',
                    rating: 4.7,
                    seller: 'SustainableLiving'
                  }
                ].map((product) => (
                  <div key={product._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
                        <div className="flex items-center space-x-1 text-sm">
                          <Star className="h-4 w-4 text-orange-400" />
                          <span className="text-gray-700 font-medium">{product.rating}</span>
                        </div>
                      </div>
                      <div className="absolute top-3 left-3 bg-orange-500 rounded-lg px-2 py-1">
                        <span className="text-xs text-white font-medium">ECO</span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                      <div className="flex items-center space-x-2 mb-4">
                        <img src={`https://images.unsplash.com/photo-14${Math.floor(Math.random() * 10)}099645785-5658abf4ff4e?w=24&h=24&fit=crop&crop=face`} className="w-6 h-6 rounded-full" alt="Seller" />
                        <span className="text-gray-600 text-sm">by {product.seller}</span>
                        <span className="text-xs text-gray-400">• {(Math.random() * 5 + 0.5).toFixed(1)}km away</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-orange-500">${product.price}</span>
                        <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                          Message Seller
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Join Our Eco Community
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Start buying and selling sustainable products in your local community. 
              Make an impact while earning or saving money.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors shadow-sm inline-flex items-center justify-center space-x-3">
                <Search className="h-5 w-5" />
                <span>Browse Products</span>
              </button>
              <button className="border border-gray-300 hover:border-orange-500 text-gray-700 hover:text-orange-600 px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center justify-center space-x-3">
                <ShoppingBag className="h-5 w-5" />
                <span>Start Selling</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-orange-500 p-2 rounded-lg">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold">EcoFinds</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Your trusted peer-to-peer marketplace for sustainable products. 
                Connecting eco-conscious communities worldwide.
              </p>
            </div>
            
            {[
              {
                title: 'Marketplace',
                links: ['Browse Products', 'Start Selling', 'Categories', 'Safety Guidelines']
              },
              {
                title: 'Community',
                links: ['Success Stories', 'Local Groups', 'Impact Reports', 'Eco Tips']
              },
              {
                title: 'Support',
                links: ['Help Center', 'Contact Us', 'Terms of Service', 'Privacy Policy']
              }
            ].map((section) => (
              <div key={section.title}>
                <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              © 2024 EcoFinds. All rights reserved. Built for a sustainable future.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-gray-800 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors cursor-pointer">
                <Globe className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}