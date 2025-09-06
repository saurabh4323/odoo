import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Product from '@/models/Product';
import { verifyToken, getTokenFromRequest } from '@/utils/auth';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;
    const skip = (page - 1) * limit;

    let query = { status: 'active' };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(query)
      .populate('seller', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const token = getTokenFromRequest(request);
    
    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { title, description, price, category, image } = await request.json();

    const product = await Product.create({
      title,
      description,
      price,
      category,
      image: image || 'https://via.placeholder.com/300x300?text=No+Image',
      seller: decoded.userId
    });

    const populatedProduct = await Product.findById(product._id).populate('seller', 'username');

    return NextResponse.json({
      message: 'Product created successfully',
      product: populatedProduct
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}