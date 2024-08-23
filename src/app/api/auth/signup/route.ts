// @ts-nocheck

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    const result = userSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: result.error.errors.map((err) => err.message).join(", ") },
        { status: 400 }
      );
    }

    const { name, email, password } = result.data;

    const userFound = await User.findOne({ email });

    if (userFound) {
      return NextResponse.json(
        { message: "Email is already in use" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await user.save();

    return NextResponse.json(
      {
        name: savedUser.name,
        email: savedUser.email,
        createdAt: savedUser.createdAt,
        updatedAt: savedUser.updatedAt,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    } else {
      console.error("Error during signup:", error);
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}
