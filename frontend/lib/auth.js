import jwt from "jsonwebtoken";

export const createToken =
  (user) => {

    return jwt.sign(
      {
        id: user.id ?? user._id,
        email: user.email,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      }
    );
  };

export const verifyToken =
  (token) => {

    return jwt.verify(
      token,
      process.env.JWT_SECRET
    );
  };

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 60 * 60 * 24 * 7,
  path: "/",
};
