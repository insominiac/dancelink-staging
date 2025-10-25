import { FastifyInstance } from 'fastify'
import { getPrisma } from '../../lib/db.js'

import bcrypt from 'bcryptjs'

export default async function adminUsers(instance: FastifyInstance) {
  // List users
  instance.get('/', async (request) => {
    const prisma = getPrisma()
    const { page = 1, limit = 10, search = '', role = '' } = (request.query || {}) as any
    const take = Math.min(Number(limit) || 10, 100)
    const skip = (Number(page) - 1) * take
    const where: any = {
      AND: [
        search
          ? {
              OR: [
                { email: { contains: search, mode: 'insensitive' } },
                { fullName: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {},
        role ? { role } : {},
      ],
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          instructor: true,
          _count: { select: { bookings: true, forumPosts: true } },
        },
      }),
      prisma.user.count({ where }),
    ])

    const sanitized = users.map((u: any) => {
      const { passwordHash, ...rest } = u
      return rest
    })
    return { users: sanitized, pagination: { total, page: Number(page), limit: take, totalPages: Math.ceil(total / take) } }
  })

  // Create user
  instance.post('/', async (request, reply) => {
    const prisma = getPrisma()
    const { email, password, fullName, phone, role, bio, isVerified } = request.body as any

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      reply.code(400)
      return { error: 'User with this email already exists' }
    }

    const passwordHash = await bcrypt.hash(String(password), 10)
    const user = await prisma.user.create({
      data: { email, passwordHash, fullName, phone, role: role || 'USER', bio, isVerified: !!isVerified },
    })

    if (role === 'INSTRUCTOR') {
      await prisma.instructor.create({ data: { userId: user.id, isActive: true } })
    }

    const { passwordHash: _ph, ...sanitized } = user as any
    reply.code(201)
    return { message: 'User created successfully', user: sanitized }
  })

  // Get user by id
  instance.get('/:id', async (request, reply) => {
    const prisma = getPrisma()
    const { id } = request.params as any
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        instructor: true,
        bookings: { include: { class: true, event: true }, orderBy: { createdAt: 'desc' }, take: 10 },
        userStyles: { include: { style: true } },
        testimonials: true,
        notifications: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
    })
    if (!user) {
      reply.code(404)
      return { error: 'User not found' }
    }
    const { passwordHash, ...sanitized } = user as any
    return sanitized
  })

  // Update user
  instance.put('/:id', async (request, reply) => {
    const prisma = getPrisma()
    const { id } = request.params as any
    const { email, password, fullName, phone, role, bio, isVerified, websiteUrl, instagramHandle, profileImage } = request.body as any

    const data: any = { email, fullName, phone, role, bio, isVerified, websiteUrl, instagramHandle, profileImage }
    if (password) data.passwordHash = await bcrypt.hash(String(password), 10)

    const user = await prisma.user.update({ where: { id }, data })

    if (role === 'INSTRUCTOR') {
      const instructor = await prisma.instructor.findUnique({ where: { userId: id } })
      if (!instructor) await prisma.instructor.create({ data: { userId: id, isActive: true } })
    } else {
      await prisma.instructor.deleteMany({ where: { userId: id } })
    }

    const { passwordHash, ...sanitized } = user as any
    return { message: 'User updated successfully', user: sanitized }
  })

  // Delete user
  instance.delete('/:id', async (request, reply) => {
    const prisma = getPrisma()
    const { id } = request.params as any

    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) {
      reply.code(404)
      return { error: 'User not found' }
    }

    await prisma.user.delete({ where: { id } })
    return { message: 'User deleted successfully' }
  })
}
