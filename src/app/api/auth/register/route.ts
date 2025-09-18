import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getDb } from '@/lib/mongo'
import { signToken, setAuthCookie } from '@/lib/jwt'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const db = await getDb()
    const existingUser = await db.collection('users').findOne({ email })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const newUser = {
      email,
      password: hashedPassword,
      name: name || email.split('@')[0],
      createdAt: new Date(),
    }

    const result = await db.collection('users').insertOne(newUser)
    
    const token = signToken({
      userId: result.insertedId.toString(),
      email: newUser.email,
      name: newUser.name
    })

    const response = NextResponse.json({
      success: true,
      user: {
        id: result.insertedId.toString(),
        email: newUser.email,
        name: newUser.name
      }
    })

    response.headers.set('Set-Cookie', setAuthCookie(token))
    return response

  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
