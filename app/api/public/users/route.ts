import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/db'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createUserSchema.parse(body)
    
    const { name, email, phone } = validatedData

    // Check if user already exists by email
    let user = await prisma.user.findUnique({
      where: { email }
    })

    if (user) {
      // User exists, return existing user ID
      return NextResponse.json({
        success: true,
        userId: user.id,
        message: 'User already exists'
      })
    }

    // Create new user with a temporary password
    const tempPassword = Math.random().toString(36).slice(-12)
    const passwordHash = await bcrypt.hash(tempPassword, 10)

    user = await prisma.user.create({
      data: {
        email,
        fullName: name,
        phone: phone || null,
        passwordHash,
        role: 'USER',
        isVerified: false
      }
    })

    return NextResponse.json({
      success: true,
      userId: user.id,
      message: 'User created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Create user error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create user', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
