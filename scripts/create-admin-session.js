const { PrismaClient } = require('@prisma/client')
const crypto = require('crypto')

const prisma = new PrismaClient()

async function createAdminSession() {
  try {
    console.log('🔍 Creating admin session...')
    
    // First, let's find the admin user
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@test.com' }
    })
    
    if (!adminUser) {
      console.log('❌ Admin user not found. Please make sure the test data is populated.')
      return
    }
    
    console.log('✅ Admin user found:', adminUser.email)
    
    // Create a session for the admin user
    const sessionId = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    
    const session = await prisma.session.create({
      data: {
        id: sessionId,
        userId: adminUser.id,
        userRole: adminUser.role,
        deviceId: 'admin-script-device',
        expiresAt: expiresAt,
        userAgent: 'Admin Session Script',
        ipAddress: '127.0.0.1'
      }
    })
    
    console.log('✅ Admin session created successfully!')
    console.log('Session ID:', sessionId)
    console.log('User ID:', adminUser.id)
    console.log('User Role:', adminUser.role)
    console.log('Expires At:', expiresAt.toISOString())
    
    console.log('\nTo use this session with API requests, set these cookies:')
    console.log('- session_id:', sessionId)
    console.log('- user_id:', adminUser.id)
    console.log('- user_role:', adminUser.role)
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

createAdminSession()