import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/db'

// Consolidated public API handler
export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const [resource, id, subResource] = params.path
    const url = new URL(request.url)

    switch (resource) {
      case 'classes':
        if (id) {
          return handleClassById(id, url.searchParams)
        } else {
          return handleClasses(url.searchParams)
        }
      
      case 'events':
        if (id) {
          return handleEventById(id, url.searchParams)
        } else {
          return handleEvents(url.searchParams)
        }
      
      case 'instructors':
        if (id) {
          return handleInstructorById(id, url.searchParams)
        } else {
          return handleInstructors(url.searchParams)
        }
      
      case 'venues':
        if (id) {
          return handleVenueById(id, url.searchParams)
        } else {
          return handleVenues(url.searchParams)
        }
      
      case 'dance-styles':
        return handleDanceStyles(url.searchParams)
      
      case 'gallery':
        return handleGallery(url.searchParams)
      
      case 'contact':
        return handleContactInfo(url.searchParams)
      
      case 'forum':
        if (subResource === 'posts') {
          if (id) {
            return handleForumPostById(id, url.searchParams)
          } else {
            return handleForumPosts(url.searchParams)
          }
        } else if (id && subResource === 'replies') {
          return handleForumPostReplies(id, url.searchParams)
        }
        return NextResponse.json({ error: 'Invalid forum endpoint' }, { status: 400 })
      
      case 'partner-search':
        return handlePartnerSearch(url.searchParams)
      
      case 'health':
        return handleHealth()
      
      default:
        return NextResponse.json(
          { error: 'Resource not found' },
          { status: 404 }
        )
    }
  } catch (error: any) {
    console.error('Public API Error:', error)
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
    const [resource, id, subResource] = params.path
    const body = await request.json()

    switch (resource) {
      case 'contact':
        return handleCreateContact(body)
      
      case 'forum':
        if (subResource === 'posts') {
          return handleCreateForumPost(body)
        } else if (id && subResource === 'replies') {
          return handleCreateForumReply(id, body)
        }
        return NextResponse.json({ error: 'Invalid forum endpoint' }, { status: 400 })
      
      case 'partner-search':
        return handlePartnerSearchSubmit(body)
      
      default:
        return NextResponse.json(
          { error: 'Resource not found' },
          { status: 404 }
        )
    }
  } catch (error: any) {
    console.error('Public API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper functions for each resource type
async function handleClasses(searchParams: URLSearchParams) {
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const search = searchParams.get('search') || ''
  const level = searchParams.get('level') || ''
  const style = searchParams.get('style') || ''
  const venue = searchParams.get('venue') || ''

  let where: any = {
    status: 'PUBLISHED'
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ]
  }

  if (level) {
    where.level = level
  }

  if (style) {
    where.danceStyles = {
      some: {
        style: {
          name: { contains: style, mode: 'insensitive' }
        }
      }
    }
  }

  if (venue) {
    where.venue = {
      name: { contains: venue, mode: 'insensitive' }
    }
  }

  const [classes, total] = await Promise.all([
    prisma.class.findMany({
      where,
      include: {
        venue: true,
        instructors: {
          include: {
            instructor: {
              include: {
                user: {
                  select: {
                    id: true,
                    fullName: true,
                    profileImage: true
                  }
                }
              }
            }
          }
        },
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
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { startDateTime: 'asc' }
    }),
    prisma.class.count({ where })
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

async function handleClassById(id: string, searchParams: URLSearchParams) {
  const classData = await prisma.class.findUnique({
    where: {
      id,
      status: 'PUBLISHED'
    },
    include: {
      venue: true,
      instructors: {
        include: {
          instructor: {
            include: {
              user: {
                select: {
                  id: true,
                  fullName: true,
                  profileImage: true
                }
              }
            }
          }
        }
      },
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

  if (!classData) {
    return NextResponse.json(
      { error: 'Class not found' },
      { status: 404 }
    )
  }

  // Check availability
  const availableSpots = classData.maxCapacity - classData._count.bookings

  return NextResponse.json({
    class: {
      ...classData,
      availableSpots
    }
  })
}

async function handleEvents(searchParams: URLSearchParams) {
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const search = searchParams.get('search') || ''
  const type = searchParams.get('type') || ''
  const venue = searchParams.get('venue') || ''

  let where: any = {
    status: 'PUBLISHED'
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ]
  }

  if (type) {
    where.type = type
  }

  if (venue) {
    where.venue = {
      name: { contains: venue, mode: 'insensitive' }
    }
  }

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      include: {
        venue: true,
        instructors: {
          include: {
            instructor: {
              include: {
                user: {
                  select: {
                    id: true,
                    fullName: true,
                    profileImage: true
                  }
                }
              }
            }
          }
        },
        eventStyles: {
          include: {
            style: true
          }
        },
        _count: {
          select: {
            bookings: true
          }
        }
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { startDateTime: 'asc' }
    }),
    prisma.event.count({ where })
  ])

  return NextResponse.json({
    events,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  })
}

async function handleEventById(id: string, searchParams: URLSearchParams) {
  const eventData = await prisma.event.findUnique({
    where: {
      id,
      status: 'PUBLISHED'
    },
    include: {
      venue: true,
      instructors: {
        include: {
          instructor: {
            include: {
              user: {
                select: {
                  id: true,
                  fullName: true,
                  profileImage: true
                }
              }
            }
          }
        }
      },
      eventStyles: {
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

  if (!eventData) {
    return NextResponse.json(
      { error: 'Event not found' },
      { status: 404 }
    )
  }

  // Check availability
  const availableSpots = eventData.maxCapacity - eventData._count.bookings

  return NextResponse.json({
    event: {
      ...eventData,
      availableSpots
    }
  })
}

async function handleInstructors(searchParams: URLSearchParams) {
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const search = searchParams.get('search') || ''
  const specialization = searchParams.get('specialization') || ''

  let where: any = {}

  if (search) {
    where.user = {
      fullName: { contains: search, mode: 'insensitive' }
    }
  }

  if (specialization) {
    where.specialization = { contains: specialization, mode: 'insensitive' }
  }

  const [instructors, total] = await Promise.all([
    prisma.instructor.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            profileImage: true
          }
        }
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.instructor.count({ where })
  ])

  return NextResponse.json({
    instructors,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  })
}

async function handleInstructorById(id: string, searchParams: URLSearchParams) {
  const instructor = await prisma.instructor.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          profileImage: true
        }
      },
      classes: {
        where: {
          status: 'PUBLISHED'
        },
        include: {
          venue: true,
          danceStyles: {
            include: {
              style: true
            }
          }
        }
      }
    }
  })

  if (!instructor) {
    return NextResponse.json(
      { error: 'Instructor not found' },
      { status: 404 }
    )
  }

  return NextResponse.json({ instructor })
}

async function handleVenues(searchParams: URLSearchParams) {
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const search = searchParams.get('search') || ''

  let where: any = {}

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { address: { contains: search, mode: 'insensitive' } }
    ]
  }

  const [venues, total] = await Promise.all([
    prisma.venue.findMany({
      where,
      include: {
        _count: {
          select: {
            classes: true,
            events: true
          }
        }
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { name: 'asc' }
    }),
    prisma.venue.count({ where })
  ])

  return NextResponse.json({
    venues,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  })
}

async function handleVenueById(id: string, searchParams: URLSearchParams) {
  const venue = await prisma.venue.findUnique({
    where: { id },
    include: {
      classes: {
        where: {
          status: 'PUBLISHED'
        }
      },
      events: {
        where: {
          status: 'PUBLISHED'
        }
      }
    }
  })

  if (!venue) {
    return NextResponse.json(
      { error: 'Venue not found' },
      { status: 404 }
    )
  }

  return NextResponse.json({ venue })
}

async function handleDanceStyles(searchParams: URLSearchParams) {
  const danceStyles = await prisma.danceStyle.findMany({
    include: {
      _count: {
        select: {
          classStyles: true,
          eventStyles: true
        }
      }
    },
    orderBy: { name: 'asc' }
  })

  return NextResponse.json({ danceStyles })
}

async function handleGallery(searchParams: URLSearchParams) {
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const category = searchParams.get('category') || ''

  // This would typically fetch from a gallery table
  // For now, returning placeholder data
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

async function handleContactInfo(searchParams: URLSearchParams) {
  // Return basic contact information
  return NextResponse.json({
    email: 'info@dancelink.com',
    phone: '+1 (555) 123-4567',
    address: '123 Dance Street, Dance City, DC 12345',
    hours: {
      monday: '9:00 AM - 9:00 PM',
      tuesday: '9:00 AM - 9:00 PM',
      wednesday: '9:00 AM - 9:00 PM',
      thursday: '9:00 AM - 9:00 PM',
      friday: '9:00 AM - 10:00 PM',
      saturday: '8:00 AM - 10:00 PM',
      sunday: '10:00 AM - 8:00 PM'
    }
  })
}

async function handleForumPosts(searchParams: URLSearchParams) {
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')

  // This would fetch from a forum posts table
  // For now, returning placeholder data
  return NextResponse.json({
    posts: [],
    pagination: {
      page,
      limit,
      total: 0,
      pages: 0
    }
  })
}

async function handleForumPostById(id: string, searchParams: URLSearchParams) {
  // This would fetch a specific forum post
  // For now, returning placeholder data
  return NextResponse.json({
    post: null
  })
}

async function handleForumPostReplies(id: string, searchParams: URLSearchParams) {
  // This would fetch replies to a forum post
  // For now, returning placeholder data
  return NextResponse.json({
    replies: []
  })
}

async function handlePartnerSearch(searchParams: URLSearchParams) {
  // This would handle partner search functionality
  // For now, returning placeholder data
  return NextResponse.json({
    profiles: [],
    total: 0
  })
}

async function handleHealth() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  })
}

// POST request handlers
async function handleCreateContact(data: any) {
  // This would typically save contact form submissions
  // For now, just returning success
  return NextResponse.json({
    success: true,
    message: 'Contact form submitted successfully'
  })
}

async function handleCreateForumPost(data: any) {
  // This would create a forum post
  // For now, returning placeholder response
  return NextResponse.json({
    success: true,
    post: { id: 'new-post-id' }
  })
}

async function handleCreateForumReply(postId: string, data: any) {
  // This would create a forum reply
  // For now, returning placeholder response
  return NextResponse.json({
    success: true,
    reply: { id: 'new-reply-id' }
  })
}

async function handlePartnerSearchSubmit(data: any) {
  // This would handle partner search form submissions
  // For now, returning placeholder response
  return NextResponse.json({
    success: true,
    message: 'Partner search request submitted'
  })
}