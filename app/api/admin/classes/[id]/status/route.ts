import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/db'
import { withAdminAuth, ApiResponse } from '@/app/lib/admin-api-wrapper'
import { ClassStatus } from '@prisma/client'

export const PUT = withAdminAuth(async (request, { params, user }) => {
  try {
    const { status } = await request.json()
    const allowed: string[] = ['DRAFT', 'PUBLISHED', 'CANCELLED']
    if (!status || !allowed.includes(status)) {
      return ApiResponse.error('Invalid status. Allowed: DRAFT, PUBLISHED, CANCELLED', 400)
    }

    const updated = await prisma.class.update({
      where: { id: params.id },
      data: { status: status as ClassStatus },
    })

    return ApiResponse.success({ message: 'Status updated', class: updated })
  } catch (error) {
    console.error('Error updating class status:', error)
    return ApiResponse.error('Failed to update class status', 500)
  }
})
