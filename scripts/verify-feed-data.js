const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function verifyFeedData() {
  try {
    console.log('🔍 Verifying feed data...')
    
    // Get all forum posts
    const posts = await prisma.forumPost.findMany({
      include: {
        user: {
          select: {
            fullName: true,
            email: true
          }
        },
        replies: {
          include: {
            user: {
              select: {
                fullName: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    console.log(`\n📋 Found ${posts.length} forum posts:`)
    
    for (const post of posts) {
      console.log(`\n📝 ${post.title}`)
      console.log(`   Category: ${post.category}`)
      console.log(`   Author: ${post.user?.fullName || 'Unknown'}`)
      console.log(`   Views: ${post.viewsCount} | Likes: ${post.likesCount} | Replies: ${post.repliesCount}`)
      console.log(`   Pinned: ${post.isPinned ? 'Yes' : 'No'}`)
      console.log(`   Created: ${post.createdAt.toLocaleDateString()}`)
      
      if (post.replies.length > 0) {
        console.log(`   Replies:`)
        for (const reply of post.replies) {
          console.log(`     - ${reply.user?.fullName || 'Unknown'}: ${reply.content.substring(0, 50)}...`)
        }
      }
    }
    
    // Show summary statistics
    const totalPosts = await prisma.forumPost.count()
    const totalReplies = await prisma.forumReply.count()
    const pinnedPosts = await prisma.forumPost.count({
      where: {
        isPinned: true
      }
    })
    
    console.log(`\n📊 Summary:`)
    console.log(`   Total Posts: ${totalPosts}`)
    console.log(`   Total Replies: ${totalReplies}`)
    console.log(`   Pinned Posts: ${pinnedPosts}`)
    
  } catch (error) {
    console.error('❌ Error verifying feed data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verifyFeedData()