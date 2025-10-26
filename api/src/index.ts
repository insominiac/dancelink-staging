import Fastify from 'fastify'
import cors from '@fastify/cors'
import { ensureDbConnection } from './lib/db.js'
import adminUsers from './routes/admin/users.js'
import publicClasses from './routes/public/classes.js'
import adminClasses from './routes/admin/classes.js'
import adminEvents from './routes/admin/events.js'
import adminBookings from './routes/admin/bookings.js'
import publicEvents from './routes/public/events.js'
import adminDanceStyles from './routes/admin/dance-styles.js'
import adminInstructors from './routes/admin/instructors.js'

const app = Fastify({ logger: false })

await app.register(cors, { origin: process.env.CORS_ORIGIN || '*' })

app.get('/healthz', async () => 'ok')
app.get('/api/health', async () => ({
  status: 'healthy',
  timestamp: new Date().toISOString(),
  service: 'dance-platform-api'
}))

app.get('/readyz', async (req, reply) => {
  try {
    await ensureDbConnection(1, 100)
    return 'ready'
  } catch {
    reply.code(503)
    return 'not ready'
  }
})

app.register(async (instance) => {
  instance.register(adminUsers, { prefix: '/admin/users' as any })
  instance.register(adminClasses, { prefix: '/admin/classes' as any })
  instance.register(adminEvents, { prefix: '/admin/events' as any })
  instance.register(adminBookings, { prefix: '/admin/bookings' as any })
  instance.register(adminDanceStyles, { prefix: '/admin/dance-styles' as any })
  instance.register(adminInstructors, { prefix: '/admin/instructors' as any })
  instance.register(publicClasses, { prefix: '/public' as any })
  instance.register(publicEvents, { prefix: '/public' as any })
}, { prefix: '/v1' as any })

// Back-compat: also mount under /api/* so Next.js middleware can rewrite 1:1
app.register(async (instance) => {
  instance.register(adminUsers, { prefix: '/admin/users' as any })
  instance.register(adminClasses, { prefix: '/admin/classes' as any })
  instance.register(adminEvents, { prefix: '/admin/events' as any })
  instance.register(adminBookings, { prefix: '/admin/bookings' as any })
  instance.register(adminDanceStyles, { prefix: '/admin/dance-styles' as any })
  instance.register(adminInstructors, { prefix: '/admin/instructors' as any })
  instance.register(publicClasses, { prefix: '/public' as any })
  instance.register(publicEvents, { prefix: '/public' as any })
}, { prefix: '/api' as any })

const port = Number(process.env.PORT || 4000)
app.listen({ port, host: '0.0.0.0' }).then(() => {
  console.log(`[api] starting on http://localhost:${port}`)
})
