import connectDB from "@/lib/db";

import User from "@/models/User";

import {
  createToken,
  cookieOptions,
} from "@/lib/auth";

import { cookies } from "next/headers";

export async function POST(req) {

  try {

    await connectDB();

    const {
      email,
      password,
    } = await req.json();

    // Find user
    const user =
      await User.findOne({
        email,
      });

    if (!user) {

      return Response.json(
        {
          success: false,
          message:
            "Invalid email",
        },

        {
          status: 401,
        }
      );
    }

    // Check password
    const isMatch =
      await user.comparePassword(
        password
      );

    if (!isMatch) {

      return Response.json(
        {
          success: false,
          message:
            "Invalid password",
        },

        {
          status: 401,
        }
      );
    }

    // Create token
    const token =
      createToken(user);

    // Store cookie
    const cookieStore =
  await cookies();

cookieStore.set(
  "token",
  token,
  cookieOptions
);

    return Response.json({
      success: true,
      message:
        "Login successful",
    });

  }catch (error) {

  console.log(error);

  return Response.json({
    success: false,
    message: error.message,
  });
  }
}