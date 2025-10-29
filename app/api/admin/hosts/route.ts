import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/app/lib/auth'
import prisma from '@/app/lib/db'

// GET all hosts with filters and pagination
export async function GET(request: NextRequest) {
  try {
    const currentUser = await requireAdmin(request)
    console.log(`✅ Admin accessing hosts: ${currentUser.email}`)
    
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') // PENDING, APPROVED, REJECTED, SUSPENDED
    const search = searchParams.get('search') || ''
    const country = searchParams.get('country') || ''
    const city = searchParams.get('city') || ''
    
    const skip = (page - 1) * limit
    
    // Build where clause
    const where: any = {
      AND: [
        status ? { applicationStatus: status } : {},
        search ? {
          OR: [
            { businessName: { contains: search, mode: 'insensitive' as const } },
            { user: { fullName: { contains: search, mode: 'insensitive' as const } } },
            { user: { email: { contains: search, mode: 'insensitive' as const } } },
            { city: { contains: search, mode: 'insensitive' as const } },
            { country: { contains: search, mode: 'insensitive' as const } }
          ]
        } : {},
        country ? { country: { contains: country, mode: 'insensitive' as const } } : {},
        city ? { city: { contains: city, mode: 'insensitive' as const } } : {}
      ]
    }

    const [hosts, total, stats] = await Promise.all([
      // Fetch hosts with pagination
      prisma.host.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { applicationStatus: 'asc' }, // Pending first
          { createdAt: 'desc' }
        ],
        include: {
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
              phone: true,
              createdAt: true
            }
          },
          approvedBy: {
            select: {
              fullName: true
            }
          },
          _count: {
            select: {
              venues: true,
              classes: true,
              events: true
            }
          }
        }
      }),
      
      // Get total count
      prisma.host.count({ where }),
      
      // Get status statistics
      prisma.host.groupBy({
        by: ['applicationStatus'],
        _count: {
          id: true
        }
      })
    ])

    // Get additional statistics for each host
    const hostsWithStats = await Promise.all(
      hosts.map(async (host) => {
        const [totalBookings, totalRevenue] = await Promise.all([
          // Count bookings for host's content
          prisma.booking.count({
            where: {
              OR: [
                { class: { hostId: host.id } },
                { event: { hostId: host.id } }
              ],
              status: { in: ['CONFIRMED', 'COMPLETED'] }
            }
          }),
          
          // Sum revenue for host's content
          prisma.booking.aggregate({
            where: {
              OR: [
                { class: { hostId: host.id } },
                { event: { hostId: host.id } }
              ],
              status: { in: ['CONFIRMED', 'COMPLETED'] }
            },
            _sum: {
              totalAmount: true
            }
          })
        ])

        return {
          ...host,
          stats: {
            totalVenues: host._count.venues,
            totalClasses: host._count.classes,
            totalEvents: host._count.events,
            totalBookings,
            totalRevenue: totalRevenue._sum.totalAmount ? parseFloat(totalRevenue._sum.totalAmount.toString()) : 0
          }
        }
      })
    )

    // Format status statistics
    const statusStats = stats.reduce((acc, stat) => {
      acc[stat.applicationStatus] = stat._count.id
      return acc
    }, {} as Record<string, number>)

    return NextResponse.json({
      hosts: hostsWithStats,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      statusStats
    })

  } catch (error: any) {
    console.error('Error fetching hosts:', error)
    
    if (error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    
    if (error.message === 'Admin privileges required') {
      return NextResponse.json({ error: 'Admin privileges required' }, { status: 403 })
    }
    
    return NextResponse.json({ error: 'Failed to fetch hosts' }, { status: 500 })
  }
}