import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export interface UserPayload {
  userId: string
  email: string
  name: string
}

export function signToken(payload: UserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): UserPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload
    return decoded
  } catch (error) {
    return null
  }
}

export async function getTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('auth-token')?.value || null
}

export async function getCurrentUser(): Promise<UserPayload | null> {
  const token = await getTokenFromCookies()
  if (!token) return null
  return verifyToken(token)
}

export function setAuthCookie(token: string): string {
  return `auth-token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax`
}

export function clearAuthCookie(): string {
  return 'auth-token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax'
}
