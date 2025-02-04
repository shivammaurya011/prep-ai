import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcrypt';

export async function POST(req) {
  await connectDB();

  try {
    const { name, email, password } = await req.json();
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();
    return Response.json({ message: 'User created successfully' });
    
  } catch (error) {
    console.error('Registration error:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}