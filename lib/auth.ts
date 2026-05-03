import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

type User = {
  id: string;
  email: string;
  role: string;
};

function getJwtSecret() {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return process.env.JWT_SECRET;
}

export function createToken(user: User) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    getJwtSecret(),
    { expiresIn: "7d" }
  );
}

export function verifyToken(token: string) {
  return jwt.verify(token, getJwtSecret());
}

export function getUserFromRequest(request: NextRequest) {
  const token =
    request.headers.get("authorization")?.replace("Bearer ", "") ||
    request.cookies.get("auth-token")?.value;

  if (!token) return null;

  try {
    return verifyToken(token) as User;
  } catch {
    return null;
  }
}
