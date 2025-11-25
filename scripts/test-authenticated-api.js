const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testAuthenticatedAPI() {
  try {
    console.log('🔍 Testing authenticated API access...')
    
    // First, let's find the admin user and session
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@test.com' }
    })
    
    if (!adminUser) {
      console.log('❌ Admin user not found.')
      return
    }
    
    // Find the most recent session for this user
    const session = await prisma.session.findFirst({
      where: { 
        userId: adminUser.id,
        userRole: 'ADMIN',
        isActive: true,
        expiresAt: { gte: new Date() }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    if (!session) {
      console.log('❌ No active admin session found.')
      return
    }
    
    console.log('✅ Admin session found:')
    console.log('Session ID:', session.id)
    console.log('User Role:', session.userRole)
    
    console.log('\nTo test the API endpoint with authentication, use these cookies:')
    console.log('- session_id:', session.id)
    console.log('- user_id:', adminUser.id)
    console.log('- user_role:', session.userRole)
    console.log('\nExample curl command:')
    console.log(`curl -H "Cookie: session_id=${session.id}; user_id=${adminUser.id}; user_role=${session.userRole}" http://localhost:3001/api/admin/content/instructors`)
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

testAuthenticatedAPI()