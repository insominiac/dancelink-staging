import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/app/lib/auth'
import prisma from '@/app/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Require authentication and HOST role
    const user = await requireAuth(request)
    
    if (user.role !== 'HOST') {
      return NextResponse.json(
        { error: 'Host privileges required' },
        { status: 403 }
      )
    }

    // Get host profile
    const host = await prisma.host.findUnique({
      where: { userId: user.id }
    })

    if (!host) {
      return NextResponse.json(
        { error: 'Host profile not found' },
        { status: 404 }
      )
    }

    // Calculate current month dates
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    // Fetch statistics
    const [
      totalVenues,
      totalClasses,
      totalEvents,
      pendingVenues,
      pendingClasses,
      pendingEvents,
      monthlyBookings,
      monthlyRevenue
    ] = await Promise.all([
      // Total venues owned by host
      prisma.venue.count({
        where: { hostId: host.id }
      }),
      
      // Total classes created by host
      prisma.class.count({
        where: { hostId: host.id }
      }),
      
      // Total events created by host
      prisma.event.count({
        where: { hostId: host.id }
      }),
      
      // Pending venue approvals
      prisma.venue.count({
        where: { 
          hostId: host.id,
          status: { in: ['DRAFT', 'PENDING_APPROVAL'] }
        }
      }),
      
      // Pending class approvals
      prisma.class.count({
        where: { 
          hostId: host.id,
          status: { in: ['DRAFT'] }
        }
      }),
      
      // Pending event approvals
      prisma.event.count({
        where: { 
          hostId: host.id,
          status: { in: ['DRAFT'] }
        }
      }),

      // Monthly bookings count for host's classes and events
      prisma.booking.count({
        where: {
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth
          },
          OR: [
            {
              class: {
                hostId: host.id
              }
            },
            {
              event: {
                hostId: host.id
              }
            }
          ],
          status: { in: ['CONFIRMED', 'COMPLETED'] }
        }
      }),

      // Monthly revenue for host's classes and events
      prisma.booking.aggregate({
        where: {
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth
          },
          OR: [
            {
              class: {
                hostId: host.id
              }
            },
            {
              event: {
                hostId: host.id
              }
            }
          ],
          status: { in: ['CONFIRMED', 'COMPLETED'] }
        },
        _sum: {
          totalAmount: true
        }
      })
    ])

    // Calculate pending approvals count
    const pendingApprovals = pendingVenues + pendingClasses + pendingEvents

    // Get total bookings (all time) for host's content
    const totalBookings = await prisma.booking.count({
      where: {
        OR: [
          {
            class: {
              hostId: host.id
            }
          },
          {
            event: {
              hostId: host.id
            }
          }
        ],
        status: { in: ['CONFIRMED', 'COMPLETED'] }
      }
    })

    const stats = {
      totalVenues,
      totalClasses,
      totalEvents,
      pendingApprovals,
      totalBookings,
      monthlyBookings,
      monthlyRevenue: monthlyRevenue._sum.totalAmount ? parseFloat(monthlyRevenue._sum.totalAmount.toString()) : 0
    }

    return NextResponse.json({ stats })

  } catch (error: any) {
    console.error('Error fetching host stats:', error)
    
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch host statistics' },
      { status: 500 }
    )
  }
}