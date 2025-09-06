import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import User from '@/models/User';
import { generateToken } from '@/utils/auth';

export async function POST(request) {
  try {
    await connectDB();
    const { username, email, password } = await request.json();

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password
    });

    const token = generateToken(user._id);

    return NextResponse.json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}