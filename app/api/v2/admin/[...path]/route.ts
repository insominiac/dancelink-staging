import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/app/lib/auth'
import prisma from '@/app/lib/db'

// Consolidated admin API handler
export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const user = await requireAdmin(request)
    const [resource, id, subResource] = params.path

    switch (resource) {
      case 'users':
        if (id && subResource) {
          return handleUserSubResource(id, subResource, request)
        } else if (id) {
          return handleUserById(id)
        } else {
          return handleUsers(request)
        }
      
      case 'classes':
        if (id && subResource) {
          return handleClassSubResource(id, subResource, request)
        } else if (id) {
          return handleClassById(id)
        } else {
          return handleClasses(request)
        }
      
      case 'events':
        if (id && subResource) {
          return handleEventSubResource(id, subResource, request)
        } else if (id) {
          return handleEventById(id)
        } else {
          return handleEvents(request)
        }
      
      case 'bookings':
        return handleBookings(request)
      
      case 'instructors':
        if (id) {
          return handleInstructorById(id)
        } else {
          return handleInstructors(request)
        }
      
      case 'venues':
        if (id) {
          return handleVenueById(id)
        } else {
          return handleVenues(request)
        }
      
      case 'dance-styles':
        if (id) {
          return handleDanceStyleById(id)
        } else {
          return handleDanceStyles(request)
        }
      
      case 'hosts':
        if (id) {
          return handleHostById(id)
        } else {
          return handleHosts(request)
        }
      
      case 'stats':
        return handleStats(request)
      
      case 'notifications':
        if (subResource === 'analytics') {
          return handleNotificationAnalytics(request)
        } else if (subResource === 'stats') {
          return handleNotificationStats(request)
        } else {
          return handleNotifications(request)
        }
      
      case 'audit-logs':
        if (subResource === 'export') {
          return handleAuditLogsExport(request)
        } else if (subResource === 'stats') {
          return handleAuditLogsStats(request)
        } else {
          return handleAuditLogs(request)
        }
      
      case 'partner-matching':
        return handlePartnerMatching(id, subResource, request)
      
      case 'content':
        return handleContent(id, subResource, request)
      
      case 'contact':
        if (id && subResource === 'reply') {
          return handleContactReply(id, request)
        } else if (id) {
          return handleContactById(id)
        } else if (subResource === 'bulk') {
          return handleContactBulk(request)
        } else {
          return handleContact(request)
        }
      
      case 'tables':
        return handleTables(request)
      
      case 'forum':
        return handleForum(id, subResource, request)
      
      case 'seo':
        if (id) {
          return handleSeoById(id)
        } else {
          return handleSeo(request)
        }
      
      case 'helpers':
        return handleHelpers(request)
      
      default:
        return NextResponse.json(
          { error: 'Resource not found' },
          { status: 404 }
        )
    }
  } catch (error: any) {
    if (error.message === 'Authentication required' || error.message === 'Admin privileges required') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }
    
    console.error('Admin API Error:', error)
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
    const user = await requireAdmin(request)
    const [resource, id, subResource] = params.path
    const body = await request.json()

    switch (resource) {
      case 'users':
        return handleCreateUser(body)
      
      case 'classes':
        return handleCreateClass(body)
      
      case 'events':
        return handleCreateEvent(body)
      
      case 'instructors':
        return handleCreateInstructor(body)
      
      case 'venues':
        return handleCreateVenue(body)
      
      case 'dance-styles':
        return handleCreateDanceStyle(body)
      
      case 'hosts':
        return handleCreateHost(body)
      
      case 'notifications':
        if (subResource === 'bulk') {
          return handleBulkNotifications(body)
        } else if (subResource === 'send') {
          return handleSendNotification(body)
        } else {
          return handleCreateNotification(body)
        }
      
      case 'contact':
        if (subResource === 'bulk') {
          return handleContactBulkAction(body)
        } else {
          return handleCreateContact(body)
        }
      
      case 'partner-matching':
        return handleCreatePartnerMatchingItem(id, subResource, body)
      
      case 'content':
        return handleCreateContent(id, body)
      
      case 'forum':
        return handleCreateForumItem(id, subResource, body)
      
      case 'seo':
        return handleCreateSeo(body)
      
      default:
        return NextResponse.json(
          { error: 'Resource not found' },
          { status: 404 }
        )
    }
  } catch (error: any) {
    if (error.message === 'Authentication required' || error.message === 'Admin privileges required') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }
    
    console.error('Admin API Error:', error)
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
    const user = await requireAdmin(request)
    const [resource, id, subResource] = params.path
    const body = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'ID required for PUT requests' },
        { status: 400 }
      )
    }

    switch (resource) {
      case 'users':
        return handleUpdateUser(id, body)
      
      case 'classes':
        if (subResource === 'status') {
          return handleUpdateClassStatus(id, body)
        } else {
          return handleUpdateClass(id, body)
        }
      
      case 'events':
        if (subResource === 'status') {
          return handleUpdateEventStatus(id, body)
        } else {
          return handleUpdateEvent(id, body)
        }
      
      case 'instructors':
        return handleUpdateInstructor(id, body)
      
      case 'venues':
        return handleUpdateVenue(id, body)
      
      case 'dance-styles':
        return handleUpdateDanceStyle(id, body)
      
      case 'hosts':
        return handleUpdateHost(id, body)
      
      case 'notifications':
        return handleUpdateNotification(id, body)
      
      case 'contact':
        return handleUpdateContact(id, body)
      
      case 'partner-matching':
        return handleUpdatePartnerMatchingItem(id, subResource, body)
      
      case 'content':
        return handleUpdateContent(id, subResource, body)
      
      case 'seo':
        return handleUpdateSeo(id, body)
      
      default:
        return NextResponse.json(
          { error: 'Resource not found' },
          { status: 404 }
        )
    }
  } catch (error: any) {
    if (error.message === 'Authentication required' || error.message === 'Admin privileges required') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }
    
    console.error('Admin API Error:', error)
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
    const user = await requireAdmin(request)
    const [resource, id] = params.path

    if (!id) {
      return NextResponse.json(
        { error: 'ID required for DELETE requests' },
        { status: 400 }
      )
    }

    switch (resource) {
      case 'users':
        return handleDeleteUser(id)
      
      case 'classes':
        return handleDeleteClass(id)
      
      case 'events':
        return handleDeleteEvent(id)
      
      case 'instructors':
        return handleDeleteInstructor(id)
      
      case 'venues':
        return handleDeleteVenue(id)
      
      case 'dance-styles':
        return handleDeleteDanceStyle(id)
      
      case 'hosts':
        return handleDeleteHost(id)
      
      case 'notifications':
        return handleDeleteNotification(id)
      
      case 'contact':
        return handleDeleteContact(id)
      
      case 'partner-matching':
        return handleDeletePartnerMatchingItem(id, params.path[2])
      
      case 'content':
        return handleDeleteContent(id)
      
      case 'seo':
        return handleDeleteSeo(id)
      
      default:
        return NextResponse.json(
          { error: 'Resource not found' },
          { status: 404 }
        )
    }
  } catch (error: any) {
    if (error.message === 'Authentication required' || error.message === 'Admin privileges required') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }
    
    console.error('Admin API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper functions for each resource type
async function handleUsers(request: NextRequest) {
  const url = new URL(request.url)
  const page = parseInt(url.searchParams.get('page') || '1')
  const limit = parseInt(url.searchParams.get('limit') || '50')
  const search = url.searchParams.get('search') || ''

  const where = search ? {
    OR: [
      { fullName: { contains: search, mode: 'insensitive' as const } },
      { email: { contains: search, mode: 'insensitive' as const } }
    ]
  } : {}

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.user.count({ where })
  ])

  return NextResponse.json({
    users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  })
}

async function handleUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      isVerified: true,
      createdAt: true,
      profileImage: true
    }
  })

  if (!user) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    )
  }

  return NextResponse.json({ user })
}

async function handleCreateUser(data: any) {
  const user = await prisma.user.create({
    data,
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      isVerified: true,
      createdAt: true
    }
  })

  return NextResponse.json({ user })
}

async function handleUpdateUser(id: string, data: any) {
  const user = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      isVerified: true,
      createdAt: true
    }
  })

  return NextResponse.json({ user })
}

async function handleDeleteUser(id: string) {
  await prisma.user.delete({
    where: { id }
  })

  return NextResponse.json({ message: 'User deleted successfully' })
}

// Similar handlers for other resources...
async function handleClasses(request: NextRequest) {
  const url = new URL(request.url)
  const page = parseInt(url.searchParams.get('page') || '1')
  const limit = parseInt(url.searchParams.get('limit') || '50')

  const [classes, total] = await Promise.all([
    prisma.class.findMany({
      include: {
        venue: true,
        instructors: {
          include: {
            instructor: true
          }
        },
        danceStyles: {
          include: {
            style: true
          }
        }
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.class.count()
  ])

  return NextResponse.json({
    classes,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  })
}

async function handleClassById(id: string) {
  const classData = await prisma.class.findUnique({
    where: { id },
    include: {
      venue: true,
      instructors: {
        include: {
          instructor: true
        }
      },
      danceStyles: {
        include: {
          style: true
        }
      }
    }
  })

  if (!classData) {
    return NextResponse.json(
      { error: 'Class not found' },
      { status: 404 }
    )
  }

  return NextResponse.json({ class: classData })
}

async function handleCreateClass(data: any) {
  const classData = await prisma.class.create({
    data,
    include: {
      venue: true,
      instructors: {
        include: {
          instructor: true
        }
      },
      danceStyles: {
        include: {
          style: true
        }
      }
    }
  })

  return NextResponse.json({ class: classData })
}

async function handleUpdateClass(id: string, data: any) {
  const classData = await prisma.class.update({
    where: { id },
    data,
    include: {
      venue: true,
      instructors: {
        include: {
          instructor: true
        }
      },
      danceStyles: {
        include: {
          style: true
        }
      }
    }
  })

  return NextResponse.json({ class: classData })
}

async function handleDeleteClass(id: string) {
  await prisma.class.delete({
    where: { id }
  })

  return NextResponse.json({ message: 'Class deleted successfully' })
}

async function handleStats(request: NextRequest) {
  const [
    totalUsers,
    totalClasses,
    totalEvents,
    totalBookings,
    totalInstructors,
    totalVenues
  ] = await Promise.all([
    prisma.user.count(),
    prisma.class.count(),
    prisma.event.count(),
    prisma.booking.count(),
    prisma.instructor.count(),
    prisma.venue.count()
  ])

  return NextResponse.json({
    stats: {
      totalUsers,
      totalClasses,
      totalEvents,
      totalBookings,
      totalInstructors,
      totalVenues
    }
  })
}

// Placeholder handlers for other resources - these would implement similar patterns
async function handleEvents(request: NextRequest) {
  // Similar to handleClasses but for events
  const events = await prisma.event.findMany({
    include: {
      venue: true,
      instructors: {
        include: {
          instructor: true
        }
      }
    }
  })
  return NextResponse.json({ events })
}

async function handleEventById(id: string) {
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      venue: true,
      instructors: {
        include: {
          instructor: true
        }
      }
    }
  })
  return NextResponse.json({ event })
}

async function handleCreateEvent(data: any) {
  const event = await prisma.event.create({ data })
  return NextResponse.json({ event })
}

async function handleUpdateEvent(id: string, data: any) {
  const event = await prisma.event.update({ where: { id }, data })
  return NextResponse.json({ event })
}

async function handleDeleteEvent(id: string) {
  await prisma.event.delete({ where: { id } })
  return NextResponse.json({ message: 'Event deleted successfully' })
}

async function handleBookings(request: NextRequest) {
  const bookings = await prisma.booking.findMany({
    include: {
      user: true,
      class: true,
      event: true
    }
  })
  return NextResponse.json({ bookings })
}

// Additional placeholder handlers
async function handleInstructors(request: NextRequest) {
  const instructors = await prisma.instructor.findMany({ include: { user: true } })
  return NextResponse.json({ instructors })
}

async function handleInstructorById(id: string) {
  const instructor = await prisma.instructor.findUnique({ where: { id }, include: { user: true } })
  return NextResponse.json({ instructor })
}

async function handleCreateInstructor(data: any) {
  const instructor = await prisma.instructor.create({ data })
  return NextResponse.json({ instructor })
}

async function handleUpdateInstructor(id: string, data: any) {
  const instructor = await prisma.instructor.update({ where: { id }, data })
  return NextResponse.json({ instructor })
}

async function handleDeleteInstructor(id: string) {
  await prisma.instructor.delete({ where: { id } })
  return NextResponse.json({ message: 'Instructor deleted successfully' })
}

async function handleVenues(request: NextRequest) {
  const venues = await prisma.venue.findMany()
  return NextResponse.json({ venues })
}

async function handleVenueById(id: string) {
  const venue = await prisma.venue.findUnique({ where: { id } })
  return NextResponse.json({ venue })
}

async function handleCreateVenue(data: any) {
  const venue = await prisma.venue.create({ data })
  return NextResponse.json({ venue })
}

async function handleUpdateVenue(id: string, data: any) {
  const venue = await prisma.venue.update({ where: { id }, data })
  return NextResponse.json({ venue })
}

async function handleDeleteVenue(id: string) {
  await prisma.venue.delete({ where: { id } })
  return NextResponse.json({ message: 'Venue deleted successfully' })
}

async function handleDanceStyles(request: NextRequest) {
  const danceStyles = await prisma.danceStyle.findMany()
  return NextResponse.json({ danceStyles })
}

async function handleDanceStyleById(id: string) {
  const danceStyle = await prisma.danceStyle.findUnique({ where: { id } })
  return NextResponse.json({ danceStyle })
}

async function handleCreateDanceStyle(data: any) {
  const danceStyle = await prisma.danceStyle.create({ data })
  return NextResponse.json({ danceStyle })
}

async function handleUpdateDanceStyle(id: string, data: any) {
  const danceStyle = await prisma.danceStyle.update({ where: { id }, data })
  return NextResponse.json({ danceStyle })
}

async function handleDeleteDanceStyle(id: string) {
  await prisma.danceStyle.delete({ where: { id } })
  return NextResponse.json({ message: 'Dance style deleted successfully' })
}

// Placeholder implementations for other handlers
async function handleHosts(request: NextRequest) { return NextResponse.json({ hosts: [] }) }
async function handleHostById(id: string) { return NextResponse.json({ host: null }) }
async function handleCreateHost(data: any) { return NextResponse.json({ host: null }) }
async function handleUpdateHost(id: string, data: any) { return NextResponse.json({ host: null }) }
async function handleDeleteHost(id: string) { return NextResponse.json({ message: 'Host deleted' }) }

async function handleNotifications(request: NextRequest) { return NextResponse.json({ notifications: [] }) }
async function handleNotificationAnalytics(request: NextRequest) { return NextResponse.json({ analytics: {} }) }
async function handleNotificationStats(request: NextRequest) { return NextResponse.json({ stats: {} }) }
async function handleCreateNotification(data: any) { return NextResponse.json({ notification: null }) }
async function handleUpdateNotification(id: string, data: any) { return NextResponse.json({ notification: null }) }
async function handleDeleteNotification(id: string) { return NextResponse.json({ message: 'Notification deleted' }) }
async function handleBulkNotifications(data: any) { return NextResponse.json({ success: true }) }
async function handleSendNotification(data: any) { return NextResponse.json({ success: true }) }

async function handleAuditLogs(request: NextRequest) { return NextResponse.json({ auditLogs: [] }) }
async function handleAuditLogsExport(request: NextRequest) { return NextResponse.json({ data: [] }) }
async function handleAuditLogsStats(request: NextRequest) { return NextResponse.json({ stats: {} }) }

async function handlePartnerMatching(id: string | undefined, subResource: string | undefined, request: NextRequest) { return NextResponse.json({ data: [] }) }
async function handleCreatePartnerMatchingItem(id: string | undefined, subResource: string | undefined, data: any) { return NextResponse.json({ success: true }) }
async function handleUpdatePartnerMatchingItem(id: string, subResource: string | undefined, data: any) { return NextResponse.json({ success: true }) }
async function handleDeletePartnerMatchingItem(id: string, subResource: string | undefined) { return NextResponse.json({ message: 'Deleted' }) }

async function handleContent(id: string | undefined, subResource: string | undefined, request: NextRequest) { return NextResponse.json({ content: {} }) }
async function handleCreateContent(id: string | undefined, data: any) { return NextResponse.json({ content: null }) }
async function handleUpdateContent(id: string, subResource: string | undefined, data: any) { return NextResponse.json({ content: null }) }
async function handleDeleteContent(id: string) { return NextResponse.json({ message: 'Content deleted' }) }

async function handleContact(request: NextRequest) { return NextResponse.json({ contacts: [] }) }
async function handleContactById(id: string) { return NextResponse.json({ contact: null }) }
async function handleContactReply(id: string, request: NextRequest) { return NextResponse.json({ success: true }) }
async function handleContactBulk(request: NextRequest) { return NextResponse.json({ data: [] }) }
async function handleCreateContact(data: any) { return NextResponse.json({ contact: null }) }
async function handleUpdateContact(id: string, data: any) { return NextResponse.json({ contact: null }) }
async function handleDeleteContact(id: string) { return NextResponse.json({ message: 'Contact deleted' }) }
async function handleContactBulkAction(data: any) { return NextResponse.json({ success: true }) }

async function handleTables(request: NextRequest) { return NextResponse.json({ tables: [] }) }

async function handleForum(id: string | undefined, subResource: string | undefined, request: NextRequest) { return NextResponse.json({ forum: [] }) }
async function handleCreateForumItem(id: string | undefined, subResource: string | undefined, data: any) { return NextResponse.json({ success: true }) }

async function handleSeo(request: NextRequest) { return NextResponse.json({ seo: [] }) }
async function handleSeoById(id: string) { return NextResponse.json({ seo: null }) }
async function handleCreateSeo(data: any) { return NextResponse.json({ seo: null }) }
async function handleUpdateSeo(id: string, data: any) { return NextResponse.json({ seo: null }) }
async function handleDeleteSeo(id: string) { return NextResponse.json({ message: 'SEO deleted' }) }

async function handleHelpers(request: NextRequest) { return NextResponse.json({ helpers: {} }) }

// Additional sub-resource handlers
async function handleUserSubResource(id: string, subResource: string, request: NextRequest) { return NextResponse.json({ data: null }) }
async function handleClassSubResource(id: string, subResource: string, request: NextRequest) { 
  if (subResource === 'status') {
    const classData = await prisma.class.findUnique({ where: { id } })
    return NextResponse.json({ status: classData?.status })
  }
  return NextResponse.json({ data: null }) 
}
async function handleEventSubResource(id: string, subResource: string, request: NextRequest) { 
  if (subResource === 'status') {
    const eventData = await prisma.event.findUnique({ where: { id } })
    return NextResponse.json({ status: eventData?.status })
  }
  return NextResponse.json({ data: null }) 
}
async function handleUpdateClassStatus(id: string, data: any) {
  const classData = await prisma.class.update({
    where: { id },
    data: { status: data.status }
  })
  return NextResponse.json({ class: classData })
}
async function handleUpdateEventStatus(id: string, data: any) {
  const eventData = await prisma.event.update({
    where: { id },
    data: { status: data.status }
  })
  return NextResponse.json({ event: eventData })
}