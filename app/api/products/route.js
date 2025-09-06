import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Product from '@/models/Product';
import { verifyToken, getTokenFromRequest } from '@/utils/auth';

export async function GET(request) {
  try {
    // Ensure database connection with timeout
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = Math.max(1, parseInt(searchParams.get('page')) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit')) || 12));
    const skip = (page - 1) * limit;

    // Build query object
    let query = { status: 'active' };
    
    if (category && category !== 'all' && category.trim() !== '') {
      query.category = category.trim();
    }
    
    if (search && search.trim() !== '') {
      query.title = { $regex: search.trim(), $options: 'i' };
    }

    console.log('Products API - Query:', query, 'Page:', page, 'Limit:', limit);

    // Use Promise.all for concurrent operations with timeout
    const queryPromise = Product.find(query)
      .populate('seller', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(); // Use lean() for better performance

    const countPromise = Product.countDocuments(query);

    // Set a timeout for database operations
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database query timeout')), 10000)
    );

    const [products, total] = await Promise.race([
      Promise.all([queryPromise, countPromise]),
      timeout
    ]);

    console.log('Products API - Found:', products.length, 'Total:', total);

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Products GET API Error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    // Return specific error messages for debugging
    if (error.name === 'MongoNetworkError') {
      return NextResponse.json(
        { error: 'Database connection failed', success: false },
        { status: 503 }
      );
    }

    if (error.message === 'Database query timeout') {
      return NextResponse.json(
        { error: 'Request timeout', success: false },
        { status: 408 }
      );
    }

    return NextResponse.json(
      { 
        error: process.env.NODE_ENV === 'production' 
          ? 'Internal server error' 
          : error.message,
        success: false 
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Ensure database connection
    await connectDB();
    
    const token = getTokenFromRequest(request);
    
    if (!token) {
      return NextResponse.json(
        { error: 'No token provided', success: false },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { error: 'Invalid token', success: false },
        { status: 401 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid JSON payload', success: false },
        { status: 400 }
      );
    }

    const { title, description, price, category, image } = body;

    // Validate required fields
    if (!title || !description || !price || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, price, category', success: false },
        { status: 400 }
      );
    }

    // Validate data types
    if (typeof price !== 'number' || price <= 0) {
      return NextResponse.json(
        { error: 'Price must be a positive number', success: false },
        { status: 400 }
      );
    }

    console.log('Creating product for user:', decoded.userId);

    const productData = {
      title: title.trim(),
      description: description.trim(),
      price: parseFloat(price),
      category: category.trim(),
      image: image || 'https://via.placeholder.com/300x300?text=No+Image',
      seller: decoded.userId,
      status: 'active'
    };

    // Create product with timeout
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database operation timeout')), 10000)
    );

    const product = await Promise.race([
      Product.create(productData),
      timeout
    ]);

    // Populate seller info
    const populatedProduct = await Product.findById(product._id)
      .populate('seller', 'username')
      .lean();

    console.log('Product created successfully:', product._id);

    return NextResponse.json({
      message: 'Product created successfully',
      product: populatedProduct,
      success: true
    }, { status: 201 });

  } catch (error) {
    console.error('Products POST API Error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { 
          error: 'Validation failed: ' + Object.values(error.errors).map(e => e.message).join(', '),
          success: false 
        },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Product already exists', success: false },
        { status: 409 }
      );
    }

    if (error.name === 'MongoNetworkError') {
      return NextResponse.json(
        { error: 'Database connection failed', success: false },
        { status: 503 }
      );
    }

    if (error.message === 'Database operation timeout') {
      return NextResponse.json(
        { error: 'Request timeout', success: false },
        { status: 408 }
      );
    }

    return NextResponse.json(
      { 
        error: process.env.NODE_ENV === 'production' 
          ? 'Internal server error' 
          : error.message,
        success: false 
      },
      { status: 500 }
    );
  }
}