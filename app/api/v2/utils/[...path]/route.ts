import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, getCurrentUser } from '@/app/lib/auth'
import prisma from '@/app/lib/db'

// Consolidated utility API handler
export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const [resource, subResource, id] = params.path
    const url = new URL(request.url)

    switch (resource) {
      case 'health':
        return handleHealth()
      
      case 'debug':
        if (subResource === 'admin-auth') {
          return handleDebugAdminAuth(request)
        }
        return handleDebugGeneral(request)
      
      case 'availability':
        if (subResource === 'lock') {
          if (id) {
            return handleGetAvailabilityLock(id)
          } else {
            return handleGetAvailabilityLocks(request, url.searchParams)
          }
        }
        return NextResponse.json({ error: 'Invalid availability endpoint' }, { status: 400 })
      
      case 'gallery':
        return handleGallery(url.searchParams)
      
      case 'bookings':
        if (subResource === 'advanced') {
          return handleAdvancedBookings(request, url.searchParams)
        } else if (subResource === 'manage' && id) {
          return handleManageBooking(request, id, url.searchParams)
        }
        return NextResponse.json({ error: 'Invalid booking endpoint' }, { status: 400 })
      
      case 'host':
        return handleHostEndpoints(request, subResource, id, url.searchParams)
      
      case 'instructor':
        return handleInstructorEndpoints(request, subResource, id, url.searchParams)
      
      default:
        return NextResponse.json(
          { error: 'Resource not found' },
          { status: 404 }
        )
    }
  } catch (error: any) {
    console.error('Utils API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const [resource, subResource, id] = params.path
    const body = await request.json()

    switch (resource) {
      case 'availability':
        if (subResource === 'lock') {
          return handleCreateAvailabilityLock(request, body)
        }
        return NextResponse.json({ error: 'Invalid availability endpoint' }, { status: 400 })
      
      case 'bookings':
        if (subResource === 'advanced') {
          return handleCreateAdvancedBooking(request, body)
        }
        return NextResponse.json({ error: 'Invalid booking endpoint' }, { status: 400 })
      
      case 'contact':
        return handleCreateContact(body)
      
      default:
        return NextResponse.json(
          { error: 'Resource not found' },
          { status: 404 }
        )
    }
  } catch (error: any) {
    console.error('Utils API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const [resource, subResource, id] = params.path
    const body = await request.json()

    switch (resource) {
      case 'availability':
        if (subResource === 'lock' && id) {
          return handleUpdateAvailabilityLock(request, id, body)
        }
        return NextResponse.json({ error: 'Invalid availability endpoint' }, { status: 400 })
      
      case 'bookings':
        if (subResource === 'manage' && id) {
          return handleUpdateBooking(request, id, body)
        }
        return NextResponse.json({ error: 'Invalid booking endpoint' }, { status: 400 })
      
      default:
        return NextResponse.json(
          { error: 'Resource not found' },
          { status: 404 }
        )
    }
  } catch (error: any) {
    console.error('Utils API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const [resource, subResource, id] = params.path

    switch (resource) {
      case 'availability':
        if (subResource === 'lock' && id) {
          return handleDeleteAvailabilityLock(request, id)
        }
        return NextResponse.json({ error: 'Invalid availability endpoint' }, { status: 400 })
      
      case 'bookings':
        if (subResource === 'manage' && id) {
          return handleCancelBooking(request, id)
        }
        return NextResponse.json({ error: 'Invalid booking endpoint' }, { status: 400 })
      
      default:
        return NextResponse.json(
          { error: 'Resource not found' },
          { status: 404 }
        )
    }
  } catch (error: any) {
    console.error('Utils API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handler functions
async function handleHealth() {
  try {
    // Basic health check
    await prisma.$queryRaw`SELECT 1`
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected'
    })
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 503 })
  }
}

async function handleDebugGeneral(request: NextRequest) {
  const user = await getCurrentUser(request).catch(() => null)
  
  return NextResponse.json({
    authenticated: !!user,
    user: user ? { id: user.id, email: user.email, role: user.role } : null,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
}

async function handleDebugAdminAuth(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    
    return NextResponse.json({
      authenticated: !!user,
      isAdmin: user?.role === 'ADMIN',
      user: user ? { id: user.id, email: user.email, role: user.role } : null,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      authenticated: false,
      isAdmin: false,
      user: null,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }
}

// Availability management
async function handleGetAvailabilityLocks(request: NextRequest, searchParams: URLSearchParams) {
  try {
    const user = await requireAuth(request)
    
    // Return placeholder data - in real implementation, fetch from availability_locks table
    return NextResponse.json({
      locks: []
    })
  } catch (error) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }
}

async function handleGetAvailabilityLock(id: string) {
  // Return placeholder data
  return NextResponse.json({
    lock: null
  })
}

async function handleCreateAvailabilityLock(request: NextRequest, data: any) {
  try {
    const user = await requireAuth(request)
    
    // Create availability lock logic here
    return NextResponse.json({
      success: true,
      lock: { id: 'new-lock-id', ...data }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }
}

async function handleUpdateAvailabilityLock(request: NextRequest, id: string, data: any) {
  try {
    const user = await requireAuth(request)
    
    // Update availability lock logic here
    return NextResponse.json({
      success: true,
      lock: { id, ...data }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }
}

async function handleDeleteAvailabilityLock(request: NextRequest, id: string) {
  try {
    const user = await requireAuth(request)
    
    // Delete availability lock logic here
    return NextResponse.json({
      success: true
    })
  } catch (error) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }
}

// Gallery management
async function handleGallery(searchParams: URLSearchParams) {
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  
  // Return placeholder gallery data
  return NextResponse.json({
    images: [],
    pagination: {
      page,
      limit,
      total: 0,
      pages: 0
    }
  })
}

// Booking management
async function handleAdvancedBookings(request: NextRequest, searchParams: URLSearchParams) {
  try {
    const user = await requireAuth(request)
    
    const bookings = await prisma.booking.findMany({
      where: {
        userId: user.id
      },
      include: {
        class: {
          include: {
            venue: true,
            instructors: {
              include: {
                instructor: {
                  include: {
                    user: {
                      select: {
                        fullName: true,
                        profileImage: true
                      }
                    }
                  }
                }
              }
            }
          }
        },
        event: {
          include: {
            venue: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json({ bookings })
  } catch (error) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }
}

async function handleCreateAdvancedBooking(request: NextRequest, data: any) {
  try {
    const user = await requireAuth(request)
    
    const booking = await prisma.booking.create({
      data: {
        ...data,
        userId: user.id
      },
      include: {
        class: true,
        event: true
      }
    })
    
    return NextResponse.json({
      success: true,
      booking
    })
  } catch (error) {
    return NextResponse.json({ error: 'Booking creation failed' }, { status: 500 })
  }
}

async function handleManageBooking(request: NextRequest, id: string, searchParams: URLSearchParams) {
  try {
    const user = await requireAuth(request)
    
    const booking = await prisma.booking.findFirst({
      where: {
        id,
        userId: user.id
      },
      include: {
        class: {
          include: {
            venue: true
          }
        },
        event: {
          include: {
            venue: true
          }
        }
      }
    })
    
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }
    
    return NextResponse.json({ booking })
  } catch (error) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }
}

async function handleUpdateBooking(request: NextRequest, id: string, data: any) {
  try {
    const user = await requireAuth(request)
    
    const booking = await prisma.booking.updateMany({
      where: {
        id,
        userId: user.id
      },
      data
    })
    
    if (booking.count === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Booking updated successfully'
    })
  } catch (error) {
    return NextResponse.json({ error: 'Booking update failed' }, { status: 500 })
  }
}

async function handleCancelBooking(request: NextRequest, id: string) {
  try {
    const user = await requireAuth(request)
    
    const booking = await prisma.booking.deleteMany({
      where: {
        id,
        userId: user.id
      }
    })
    
    if (booking.count === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Booking cancelled successfully'
    })
  } catch (error) {
    return NextResponse.json({ error: 'Booking cancellation failed' }, { status: 500 })
  }
}

// Contact management
async function handleCreateContact(data: any) {
  try {
    // In a real implementation, save to contact table
    // For now, just return success
    return NextResponse.json({
      success: true,
      message: 'Contact message sent successfully'
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to send contact message'
    }, { status: 500 })
  }
}

// Host endpoints
async function handleHostEndpoints(request: NextRequest, subResource: string | undefined, id: string | undefined, searchParams: URLSearchParams) {
  try {
    const user = await requireAuth(request)
    
    if (user.role !== 'HOST' && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Host access required' }, { status: 403 })
    }
    
    switch (subResource) {
      case 'academies':
        return NextResponse.json({ academies: [] })
      case 'bookings':
        return NextResponse.json({ bookings: [] })
      case 'classes':
        return NextResponse.json({ classes: [] })
      case 'competitions':
        return NextResponse.json({ competitions: [] })
      case 'events':
        return NextResponse.json({ events: [] })
      case 'profile':
        return NextResponse.json({ profile: null })
      case 'stats':
        return NextResponse.json({ stats: {} })
      case 'venues':
        return NextResponse.json({ venues: [] })
      default:
        return NextResponse.json({ error: 'Invalid host endpoint' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }
}

// Instructor endpoints
async function handleInstructorEndpoints(request: NextRequest, subResource: string | undefined, id: string | undefined, searchParams: URLSearchParams) {
  try {
    const user = await requireAuth(request)
    
    if (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Instructor access required' }, { status: 403 })
    }
    
    switch (subResource) {
      case 'classes':
        if (id) {
          return handleInstructorClassDetails(user, id, searchParams)
        }
        return handleInstructorClasses(user, searchParams)
      case 'dashboard':
        if (id) {
          return NextResponse.json({ dashboard: null })
        }
        return NextResponse.json({ dashboard: {} })
      case 'earnings':
        return handleInstructorEarnings(user, searchParams)
      case 'engagement':
        if (id) {
          return NextResponse.json({ engagement: {} })
        }
        return NextResponse.json({ error: 'Instructor ID required' }, { status: 400 })
      case 'messages':
        return NextResponse.json({ messages: [] })
      case 'performance':
        if (id) {
          return NextResponse.json({ performance: {} })
        }
        return NextResponse.json({ error: 'Instructor ID required' }, { status: 400 })
      case 'profile':
        if (id) {
          return NextResponse.json({ profile: null })
        }
        return NextResponse.json({ profile: {} })
      case 'resources':
        if (id) {
          return NextResponse.json({ resource: null })
        }
        return NextResponse.json({ resources: [] })
      case 'students':
        return NextResponse.json({ students: [] })
      default:
        return NextResponse.json({ error: 'Invalid instructor endpoint' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }
}

async function handleInstructorClasses(user: any, searchParams: URLSearchParams) {
  // Get instructor record
  const instructor = await prisma.instructor.findFirst({
    where: { userId: user.id }
  })
  
  if (!instructor) {
    return NextResponse.json({ error: 'Instructor profile not found' }, { status: 404 })
  }
  
  const classes = await prisma.class.findMany({
    where: {
      instructors: {
        some: {
          instructorId: instructor.id
        }
      }
    },
    include: {
      venue: true,
      danceStyles: {
        include: {
          style: true
        }
      },
      _count: {
        select: {
          bookings: true
        }
      }
    }
  })
  
  return NextResponse.json({ classes })
}

async function handleInstructorClassDetails(user: any, classId: string, searchParams: URLSearchParams) {
  const instructor = await prisma.instructor.findFirst({
    where: { userId: user.id }
  })
  
  if (!instructor) {
    return NextResponse.json({ error: 'Instructor profile not found' }, { status: 404 })
  }
  
  const classData = await prisma.class.findFirst({
    where: {
      id: classId,
      instructors: {
        some: {
          instructorId: instructor.id
        }
      }
    },
    include: {
      venue: true,
      danceStyles: {
        include: {
          style: true
        }
      },
      bookings: {
        include: {
          user: {
            select: {
              fullName: true,
              email: true
            }
          }
        }
      }
    }
  })
  
  if (!classData) {
    return NextResponse.json({ error: 'Class not found' }, { status: 404 })
  }
  
  return NextResponse.json({ class: classData })
}

async function handleInstructorEarnings(user: any, searchParams: URLSearchParams) {
  const instructor = await prisma.instructor.findFirst({
    where: { userId: user.id }
  })
  
  if (!instructor) {
    return NextResponse.json({ error: 'Instructor profile not found' }, { status: 404 })
  }
  
  // In a real implementation, calculate earnings from bookings and transactions
  return NextResponse.json({
    earnings: {
      total: 0,
      thisMonth: 0,
      pending: 0,
      transactions: []
    }
  })
}