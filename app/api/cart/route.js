import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
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

    const cart = await Cart.findOne({ user: decoded.userId })
      .populate({
        path: 'items.product',
        select: 'title price image status'
      });

    if (!cart) {
      return NextResponse.json({
        cart: { items: [], totalAmount: 0 }
      });
    }

    return NextResponse.json({ cart });

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

    const { productId, quantity = 1 } = await request.json();

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    let cart = await Cart.findOne({ user: decoded.userId });

    if (!cart) {
      cart = await Cart.create({
        user: decoded.userId,
        items: [{ product: productId, quantity }],
        totalAmount: product.price * quantity
      });
    } else {
      const existingItemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
      );

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }

      // Recalculate total amount
      let totalAmount = 0;
      for (const item of cart.items) {
        const productPrice = await Product.findById(item.product).select('price');
        totalAmount += productPrice.price * item.quantity;
      }
      cart.totalAmount = totalAmount;

      await cart.save();
    }

    const updatedCart = await Cart.findById(cart._id)
      .populate({
        path: 'items.product',
        select: 'title price image status'
      });

    return NextResponse.json({
      message: 'Item added to cart',
      cart: updatedCart
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
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

    const { productId, quantity } = await request.json();

    const cart = await Cart.findOne({ user: decoded.userId });
    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { error: 'Item not found in cart' },
        { status: 404 }
      );
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    // Recalculate total amount
    let totalAmount = 0;
    for (const item of cart.items) {
      const product = await Product.findById(item.product).select('price');
      totalAmount += product.price * item.quantity;
    }
    cart.totalAmount = totalAmount;

    await cart.save();

    const updatedCart = await Cart.findById(cart._id)
      .populate({
        path: 'items.product',
        select: 'title price image status'
      });

    return NextResponse.json({
      message: 'Cart updated',
      cart: updatedCart
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
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

    await Cart.findOneAndDelete({ user: decoded.userId });

    return NextResponse.json({
      message: 'Cart cleared'
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}