import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Product from '@/models/Product';
import { verifyToken, getTokenFromRequest } from '@/utils/auth';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const product = await Product.findById(id).populate('seller', 'username');

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
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

    const { id } = params;
    const { title, description, price, category, image } = await request.json();

    const product = await Product.findOne({ _id: id, seller: decoded.userId });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found or unauthorized' },
        { status: 404 }
      );
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { title, description, price, category, image },
      { new: true, runValidators: true }
    ).populate('seller', 'username');

    return NextResponse.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
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

    const { id } = params;

    const product = await Product.findOneAndDelete({ _id: id, seller: decoded.userId });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Product deleted successfully'
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}