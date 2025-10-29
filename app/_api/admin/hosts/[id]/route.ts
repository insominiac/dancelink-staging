import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/app/lib/auth'
import prisma from '@/app/lib/db'

// GET specific host details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await requireAdmin(request)
    const { id } = params

    const host = await prisma.host.findUnique({
      where: { id },
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
            fullName: true,
            email: true
          }
        },
        venues: {
          include: {
            _count: {
              select: {
                classes: true,
                events: true
              }
            }
          }
        },
        classes: {
          include: {
            venue: {
              select: {
                name: true
              }
            },
            _count: {
              select: {
                bookings: true
              }
            }
          }
        },
        events: {
          include: {
            venue: {
              select: {
                name: true
              }
            },
            _count: {
              select: {
                bookings: true
              }
            }
          }
        }
      }
    })

    if (!host) {
      return NextResponse.json({ error: 'Host not found' }, { status: 404 })
    }

    // Get detailed statistics
    const [totalBookings, totalRevenue, recentActivity] = await Promise.all([
      prisma.booking.count({
        where: {
          OR: [
            { class: { hostId: host.id } },
            { event: { hostId: host.id } }
          ]
        }
      }),
      
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
      }),

      // Get recent activity (bookings, content created)
      prisma.booking.findMany({
        where: {
          OR: [
            { class: { hostId: host.id } },
            { event: { hostId: host.id } }
          ]
        },
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              fullName: true,
              email: true
            }
          },
          class: {
            select: {
              title: true
            }
          },
          event: {
            select: {
              title: true
            }
          }
        }
      })
    ])

    const hostDetails = {
      ...host,
      stats: {
        totalVenues: host.venues.length,
        totalClasses: host.classes.length,
        totalEvents: host.events.length,
        totalBookings,
        totalRevenue: totalRevenue._sum.totalAmount ? parseFloat(totalRevenue._sum.totalAmount.toString()) : 0
      },
      recentActivity
    }

    return NextResponse.json({ host: hostDetails })

  } catch (error: any) {
    console.error('Error fetching host details:', error)
    
    if (error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    
    if (error.message === 'Admin privileges required') {
      return NextResponse.json({ error: 'Admin privileges required' }, { status: 403 })
    }
    
    return NextResponse.json({ error: 'Failed to fetch host details' }, { status: 500 })
  }
}

// PUT update host status (approve, reject, suspend)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await requireAdmin(request)
    const { id } = params
    const body = await request.json()
    const { action, rejectionReason } = body

    if (!['approve', 'reject', 'suspend', 'reactivate'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const host = await prisma.host.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            email: true,
            fullName: true
          }
        }
      }
    })

    if (!host) {
      return NextResponse.json({ error: 'Host not found' }, { status: 404 })
    }

    let updateData: any = {
      updatedAt: new Date()
    }

    switch (action) {
      case 'approve':
        updateData.applicationStatus = 'APPROVED'
        updateData.isApproved = true
        updateData.approvedAt = new Date()
        updateData.approvedByUserId = currentUser.id
        updateData.rejectionReason = null
        break

      case 'reject':
        if (!rejectionReason) {
          return NextResponse.json({ error: 'Rejection reason is required' }, { status: 400 })
        }
        updateData.applicationStatus = 'REJECTED'
        updateData.isApproved = false
        updateData.rejectionReason = rejectionReason
        updateData.approvedAt = null
        updateData.approvedByUserId = null
        break

      case 'suspend':
        updateData.applicationStatus = 'SUSPENDED'
        updateData.isApproved = false
        updateData.rejectionReason = rejectionReason || 'Account suspended by admin'
        break

      case 'reactivate':
        updateData.applicationStatus = 'APPROVED'
        updateData.isApproved = true
        updateData.approvedAt = new Date()
        updateData.approvedByUserId = currentUser.id
        updateData.rejectionReason = null
        break
    }

    const updatedHost = await prisma.host.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true
          }
        },
        approvedBy: {
          select: {
            fullName: true
          }
        }
      }
    })

    // TODO: Send notification email to host about status change
    console.log(`✅ Admin ${currentUser.email} ${action}ed host ${host.businessName} (${host.user.email})`)

    return NextResponse.json({
      message: `Host ${action}ed successfully`,
      host: updatedHost
    })

  } catch (error: any) {
    console.error('Error updating host:', error)
    
    if (error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    
    if (error.message === 'Admin privileges required') {
      return NextResponse.json({ error: 'Admin privileges required' }, { status: 403 })
    }
    
    return NextResponse.json({ error: 'Failed to update host' }, { status: 500 })
  }
}

// DELETE host (soft delete - keep for records)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await requireAdmin(request)
    const { id } = params

    const host = await prisma.host.findUnique({
      where: { id },
      include: {
        user: true,
        venues: true,
        classes: true,
        events: true
      }
    })

    if (!host) {
      return NextResponse.json({ error: 'Host not found' }, { status: 404 })
    }

    // Check if host has active content
    if (host.venues.length > 0 || host.classes.length > 0 || host.events.length > 0) {
      return NextResponse.json({
        error: 'Cannot delete host with existing venues, classes, or events. Please remove all content first.'
      }, { status: 400 })
    }

    // Soft delete by suspending permanently
    await prisma.host.update({
      where: { id },
      data: {
        applicationStatus: 'SUSPENDED',
        isApproved: false,
        rejectionReason: 'Account permanently suspended by admin',
        updatedAt: new Date()
      }
    })

    console.log(`✅ Admin ${currentUser.email} permanently suspended host ${host.businessName}`)

    return NextResponse.json({ message: 'Host permanently suspended' })

  } catch (error: any) {
    console.error('Error deleting host:', error)
    
    if (error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    
    if (error.message === 'Admin privileges required') {
      return NextResponse.json({ error: 'Admin privileges required' }, { status: 403 })
    }
    
    return NextResponse.json({ error: 'Failed to delete host' }, { status: 500 })
  }
}