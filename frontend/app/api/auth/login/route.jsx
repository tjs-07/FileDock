import db from "@/lib/db";

import {
  createToken,
  cookieOptions,
} from "@/lib/auth";

import bcrypt from "bcryptjs";

import { NextResponse } from "next/server";

export const runtime = "nodejs";


async function ensureUsersTable() {

  await db.query(

    `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`
  );

}


function authResponse(message, status = 401) {

  return NextResponse.json(
    {
      success: false,
      message,
    },
    {
      status,
    }
  );

}


export async function POST(req) {

  try {

    await ensureUsersTable();

    const {
      email,
      password,
    } = await req.json();

    const normalizedEmail =
      email?.toString().trim().toLowerCase();

    if (!normalizedEmail || !password) {

      return authResponse(
        "Email and password are required",
        400
      );

    }

    const [users] = await db.query(

      `SELECT *
       FROM users
       WHERE email = ?
       LIMIT 1`,

      [normalizedEmail]
    );

    let user = users[0];

    if (!user) {

      const [countRows] = await db.query(
        `SELECT COUNT(*) AS totalUsers
         FROM users`
      );

      if (countRows[0].totalUsers > 0) {

        return authResponse("Invalid email");

      }

      const hashedPassword =
        await bcrypt.hash(password, 10);

      const [result] = await db.query(

        `INSERT INTO users (email, password)
         VALUES (?, ?)`,

        [
          normalizedEmail,
          hashedPassword,
        ]
      );

      user = {
        id: result.insertId,
        email: normalizedEmail,
        password: hashedPassword,
      };

    } else {

      const isMatch =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!isMatch) {

        return authResponse("Invalid password");

      }

    }

    const token =
      createToken(user);

    const response =
      NextResponse.json({
        success: true,
        message: "Login successful",
      });

    response.cookies.set(
      "token",
      token,
      cookieOptions
    );

    return response;

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );

  }

}
