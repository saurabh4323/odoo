import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Order from '@/models/Order';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import { verifyToken, getTokenFromRequest } from '@/utils/auth';

export async function GET(request) {
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

    const orders = await Order.find({ user: decoded.userId })
      .sort({ createdAt: -1 })
      .populate('items.product', 'title image');

    return NextResponse.json({ orders });

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

    // Get user's cart
    const cart = await Cart.findOne({ user: decoded.userId })
      .populate('items.product', 'title price');

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Create order items from cart items
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      title: item.product.title,
      price: item.product.price,
      quantity: item.quantity
    }));

    // Create order
    const order = await Order.create({
      user: decoded.userId,
      items: orderItems,
      totalAmount: cart.totalAmount
    });

    // Clear cart after successful order
    await Cart.findOneAndDelete({ user: decoded.userId });

    const populatedOrder = await Order.findById(order._id)
      .populate('items.product', 'title image');

    return NextResponse.json({
      message: 'Order placed successfully',
      order: populatedOrder
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}