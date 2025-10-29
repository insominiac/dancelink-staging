import { FastifyInstance } from 'fastify'
import { getPrisma } from '../../lib/db.js'

function parseJsonOut(field: string | null) {
  if (!field) return null
  try { return JSON.parse(field) } catch { return field }
}

function parseJsonIn(field: any) {
  if (field === null || field === undefined) return null
  if (typeof field === 'string') {
    try { return JSON.stringify(JSON.parse(field)) } catch { return field }
  }
  return JSON.stringify(field)
}

export default async function adminDanceStyles(instance: FastifyInstance) {
  // GET by id
  instance.get('/:id', async (request, reply) => {
    const prisma = getPrisma()
    const { id } = request.params as any
    const ds = await prisma.danceStyle.findUnique({
      where: { id },
      include: { _count: { select: { classStyles: true, eventStyles: true, userStyles: true } } },
    })
    if (!ds) {
      reply.code(404)
      return { success: false, message: 'Dance style not found' }
    }
    const parsed = {
      ...ds,
      characteristics: parseJsonOut(ds.characteristics as any),
      benefits: parseJsonOut(ds.benefits as any),
      schedule: parseJsonOut(ds.schedule as any),
    }
    return { success: true, data: parsed }
  })

  // PUT update
  instance.put('/:id', async (request) => {
    const prisma = getPrisma()
    const { id } = request.params as any
    const body = (request.body || {}) as any
    const {
      name,
      category,
      icon,
      subtitle,
      description,
      difficulty,
      origin,
      musicStyle,
      characteristics,
      benefits,
      schedule,
      price,
      instructors,
      image,
      videoUrl,
      isActive,
      isFeatured,
      sortOrder,
    } = body

    if (!name) {
      ;(request as any).reply?.code(400)
      return { success: false, message: 'Name is required' }
    }

    const updated = await prisma.danceStyle.update({
      where: { id },
      data: {
        name,
        category,
        icon,
        subtitle,
        description,
        difficulty,
        origin,
        musicStyle,
        characteristics: parseJsonIn(characteristics),
        benefits: parseJsonIn(benefits),
        schedule: parseJsonIn(schedule),
        price,
        instructors,
        image,
        videoUrl,
        isActive,
        isFeatured,
        sortOrder,
      },
      include: { _count: { select: { classStyles: true, eventStyles: true, userStyles: true } } },
    })
    return { success: true, data: updated, message: 'Dance style updated successfully' }
  })

  // DELETE
  instance.delete('/:id', async (request, reply) => {
    const prisma = getPrisma()
    const { id } = request.params as any
    const style = await prisma.danceStyle.findUnique({
      where: { id },
      include: { _count: { select: { classStyles: true, eventStyles: true, userStyles: true } } },
    })
    if (!style) {
      reply.code(404)
      return { success: false, message: 'Dance style not found' }
    }
    const total = (style as any)._count.classStyles + (style as any)._count.eventStyles + (style as any)._count.userStyles
    if (total > 0) {
      reply.code(400)
      return { success: false, message: `Cannot delete dance style. It is associated with ${style._count.classStyles} classes, ${style._count.eventStyles} events, and ${style._count.userStyles} user profiles.` }
    }
    await prisma.danceStyle.delete({ where: { id } })
    return { success: true, message: 'Dance style deleted successfully' }
  })
}
