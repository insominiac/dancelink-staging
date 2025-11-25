const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function populateFeedData() {
  try {
    console.log('🌱 Populating feed data...')
    
    // Sample feed posts data
    const feedPosts = [
      {
        category: 'Announcements',
        title: 'New Dance Studio Opening!',
        content: 'We\'re excited to announce the opening of our new downtown location! Starting next month, you\'ll have access to our state-of-the-art facilities including 4 new studios, a performance stage, and a dedicated social area. Join us for our grand opening celebration on Saturday, December 15th at 6 PM. First class is free for all new students!',
        viewsCount: 125,
        likesCount: 42,
        repliesCount: 8,
        isPinned: true
      },
      {
        category: 'Events',
        title: 'Winter Showcase Registration Now Open',
        content: 'Registration is now open for our annual Winter Showcase! This year\'s theme is "Journey Through Dance" and we\'re looking for performers of all levels. Whether you\'re a beginner in your first class or a seasoned performer, there\'s a spot for you on our stage. Registration closes November 30th. Sign up now through your student portal.',
        viewsCount: 89,
        likesCount: 27,
        repliesCount: 15,
        isPinned: true
      },
      {
        category: 'Classes',
        title: 'New Advanced Salsa Technique Series',
        content: 'We\'re launching a new Advanced Salsa Technique series starting next week! This 6-week intensive course will focus on complex turn patterns, shines, and performance quality. Instructor Carlos will be leading this series, and enrollment is limited to 12 students to ensure personalized attention. Pre-registration is required.',
        viewsCount: 67,
        likesCount: 18,
        repliesCount: 5,
        isPinned: false
      },
      {
        category: 'Community',
        title: 'Student of the Month: Maria Rodriguez',
        content: 'Congratulations to Maria Rodriguez, our Student of the Month! Maria has shown incredible dedication and improvement in her Bachata classes over the past few months. Her musicality and connection have blossomed, and she\'s become a wonderful example for newer students. Keep up the amazing work, Maria!',
        viewsCount: 142,
        likesCount: 56,
        repliesCount: 12,
        isPinned: false
      },
      {
        category: 'Tips',
        title: '5 Tips for Improving Your Musicality',
        content: 'Musicality is one of the most important aspects of dance, yet it\'s often overlooked by beginners. Here are 5 tips to help you develop better musicality:\n1. Listen to the music outside of class\n2. Count the beats and identify the rhythm\n3. Practice dancing to different genres\n4. Focus on expressing the emotion of the music\n5. Record yourself and analyze your movement',
        viewsCount: 203,
        likesCount: 89,
        repliesCount: 22,
        isPinned: false
      }
    ]
    
    // Get some sample users for the posts
    const users = await prisma.user.findMany({
      take: 5
    })
    
    if (users.length === 0) {
      console.log('❌ No users found. Creating sample users first...')
      
      // Create sample users if none exist
      for (let i = 1; i <= 3; i++) {
        await prisma.user.create({
          data: {
            email: `user${i}@dancelink.com`,
            passwordHash: 'hashed_password_here',
            fullName: `User ${i}`,
            role: 'USER'
          }
        })
      }
      
      // Refresh the users list
      users = await prisma.user.findMany({
        take: 5
      })
    }
    
    console.log(`📝 Creating ${feedPosts.length} feed posts...`)
    
    // Create feed posts
    for (let i = 0; i < feedPosts.length; i++) {
      const postData = feedPosts[i]
      const userId = users[i % users.length].id
      
      const post = await prisma.forumPost.create({
        data: {
          userId,
          category: postData.category,
          title: postData.title,
          content: postData.content,
          viewsCount: postData.viewsCount,
          likesCount: postData.likesCount,
          repliesCount: postData.repliesCount,
          isPinned: postData.isPinned,
          isLocked: false,
          createdAt: new Date(Date.now() - (feedPosts.length - i) * 24 * 60 * 60 * 1000) // Stagger creation dates
        }
      })
      
      console.log(`✅ Created post: ${post.title}`)
    }
    
    // Add some sample replies to the posts
    console.log('💬 Adding sample replies...')
    
    const posts = await prisma.forumPost.findMany()
    
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i]
      const replyUser = users[(i + 1) % users.length]
      
      // Add 1-3 replies to each post
      const replyCount = Math.floor(Math.random() * 3) + 1
      
      for (let j = 0; j < replyCount; j++) {
        await prisma.forumReply.create({
          data: {
            postId: post.id,
            userId: replyUser.id,
            content: `This is a great post! Thanks for sharing. I'm looking forward to the new studio opening. ${j > 0 ? 'Count me in!' : 'Will there be parking available?'}`,
            likesCount: Math.floor(Math.random() * 10),
            createdAt: new Date(post.createdAt.getTime() + (j + 1) * 60 * 60 * 1000)
          }
        })
      }
      
      // Update the replies count on the post
      await prisma.forumPost.update({
        where: { id: post.id },
        data: { repliesCount: replyCount }
      })
    }
    
    console.log('\n🎉 Feed data population complete!')
    console.log(`✅ Created ${feedPosts.length} forum posts with replies`)
    
    // Show summary
    const totalPosts = await prisma.forumPost.count()
    const totalReplies = await prisma.forumReply.count()
    
    console.log(`📊 Total posts: ${totalPosts}`)
    console.log(`📊 Total replies: ${totalReplies}`)
    
  } catch (error) {
    console.error('❌ Error populating feed data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

populateFeedData()