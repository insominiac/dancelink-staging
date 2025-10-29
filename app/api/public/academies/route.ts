import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/db'

// GET /api/public/academies
// Returns published academies for public listing
export async function GET(_request: NextRequest) {
  try {
    const academies = await prisma.academy.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        city: true,
        country: true,
        logoUrl: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ academies })
  } catch (error) {
    console.error('Public academies list error:', error)
    return NextResponse.json({ error: 'Failed to fetch academies' }, { status: 500 })
  }
}
