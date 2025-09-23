import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export type AuthUser = {
  sub: string;
  role?: string;
  email?: string;
};

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "dev-secret",
    ) as AuthUser;
    return decoded;
  } catch {
    return null;
  }
}

export function isAdmin(user: AuthUser | null): boolean {
  return !!user && (user.role === "ADMIN" || user.role === "SUPER_ADMIN");
}

export function requireAdmin(request: NextRequest): AuthUser | null {
  const token = request.cookies.get("orna_admin_token")?.value;
  if (!token) return null;
  const user = verifyToken(token);
  if (!isAdmin(user)) return null;
  return user;
}
