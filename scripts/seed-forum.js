const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedForum() {
  try {
    console.log('🌱 Seeding forum data...')

    // Create multiple test users for more realistic forum interactions
    const sampleUsers = [
      {
        email: 'maria.rodriguez@example.com',
        fullName: 'Maria Rodriguez',
        bio: 'Passionate salsa dancer from Miami',
        profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b1c7?w=400'
      },
      {
        email: 'carlos.martinez@example.com', 
        fullName: 'Carlos Martinez',
        bio: 'Bachata instructor with 10 years experience',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
      },
      {
        email: 'james.wilson@example.com',
        fullName: 'James Wilson',
        bio: 'Learning salsa and bachata, love the community!',
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'
      },
      {
        email: 'emma.thompson@example.com',
        fullName: 'Emma Thompson', 
        bio: 'Intermediate dancer from Austin, TX',
        profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400'
      },
      {
        email: 'diego.fernandez@example.com',
        fullName: 'Diego Fernandez',
        bio: 'Music lover and dance enthusiast',
        profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'
      },
      {
        email: 'sofia.martinez@example.com',
        fullName: 'Sofia Martinez',
        bio: 'Overcoming dance anxiety, one step at a time!',
        profileImage: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400'
      }
    ]

    // Create users if they don't exist
    const createdUsers = []
    for (const userData of sampleUsers) {
      let user = await prisma.user.findUnique({
        where: { email: userData.email }
      })
      
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: userData.email,
            passwordHash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewWueTzwAhf6nB26', // password: test123
            fullName: userData.fullName,
            bio: userData.bio,
            profileImage: userData.profileImage,
            role: 'USER',
            isVerified: true,
          },
        })
        console.log(`✅ Created user: ${userData.fullName}`)
      }
      createdUsers.push(user)
    }

    // Create comprehensive sample forum posts with better multilingual content
    const samplePosts = [
      {
        title: 'Welcome to the Dance Community Forum!',
        content: 'This is the first post in our community forum. Feel free to introduce yourself, ask questions about dance techniques, or share your experiences. Let\'s build a supportive community together!\n\nWhether you\'re a complete beginner or an experienced dancer, this is your space to connect with fellow dance enthusiasts. Share your journey, celebrate your achievements, and help others along the way!',
        category: 'general',
        isPinned: true,
        userId: createdUsers[1].id // Carlos as moderator
      },
      {
        title: 'Best beginner-friendly salsa moves?',
        content: 'I\'m new to salsa dancing and looking for some basic moves to practice at home. Any suggestions for fundamental steps that will help me build confidence before my first class?\n\nI\'ve watched some YouTube videos but would love to hear from experienced dancers about which moves are most important to master first. Also, any tips for practicing without a partner?',
        category: 'beginners',
        userId: createdUsers[0].id // Maria
      },
      {
        title: 'Upcoming bachata social in Miami - March 15th', 
        content: 'Hey everyone! There\'s a fantastic bachata social happening at Ocean Drive Studio next month. Live band, great vibes, and dancers of all levels welcome. Who\'s planning to attend?\n\n📅 Date: March 15th\n🕰️ Time: 8 PM - 2 AM\n📍 Location: Ocean Drive Studio, Miami\n🎵 Live band: Los Hermanos del Bachata\n💵 Entry: $20\n\nThere will be a beginner workshop from 8-9 PM, so don\'t worry if you\'re just starting out!',
        category: 'events',
        isPinned: true,
        userId: createdUsers[1].id // Carlos
      },
      {
        title: 'Tips for leading vs following in partner dances',
        content: 'I\'ve been dancing for about 6 months and want to improve my leading skills in salsa and bachata. What are some key techniques that made the biggest difference for you experienced dancers?\n\nI often struggle with:\n- Clear communication through connection\n- Timing my leads properly\n- Staying relaxed while maintaining frame\n\nAny advice would be greatly appreciated!',
        category: 'technique', 
        userId: createdUsers[2].id // James
      },
      {
        title: 'Looking for practice partner in Austin area',
        content: 'Intermediate level dancer seeking a regular practice partner for salsa and bachata. I\'ve been dancing for about 2 years and am comfortable with most basic to intermediate moves.\n\nI\'m available most evenings and weekends for practice sessions. Ideally looking for someone who:\n\n• Has similar experience level\n• Is committed to regular practice\n• Wants to work on technique and new moves\n• Is patient and supportive\n\nDM me if you\'re interested!',
        category: 'partners',
        userId: createdUsers[3].id // Emma
      },
      {
        title: 'Best Latin music for practicing at home',
        content: 'Can anyone recommend some great songs for practicing salsa and bachata footwork? Looking for tracks with clear beats and good energy for solo practice sessions.\n\nWhat I\'m looking for:\n🎵 Clear timing and rhythm\n🎵 Good energy to keep motivation up\n🎵 Variety in tempo for different skill levels\n\nPlease share your practice playlists! Spotify links welcome 😊',
        category: 'music',
        userId: createdUsers[4].id // Diego  
      },
      {
        title: 'How to overcome dance floor anxiety?',
        content: 'I love dancing in class but get really nervous at socials and parties. Any advice on building confidence to dance in front of others? How did you overcome your initial stage fright?\n\nI\'ve been taking classes for 4 months and feel confident during lessons, but when it comes to social dancing, I freeze up. The fear of making mistakes or looking silly really holds me back.\n\nWhat strategies worked for you? Any mental tricks or gradual approaches to building confidence?',
        category: 'general',
        userId: createdUsers[5].id // Sofia
      },
      {
        title: 'Advanced bachata techniques - body rolls and isolations',
        content: 'For those working on advanced bachata styling, let\'s discuss body rolls and isolations. What exercises have helped you develop smoother, more natural movement?\n\nI\'m particularly interested in:\n• Hip isolation exercises\n• Smooth transitions between movements\n• Incorporating styling into partner work\n• Building core strength for better control\n\nShare your favorite drills and practice routines!',
        category: 'technique',
        userId: createdUsers[1].id // Carlos
      },
      {
        title: 'Salsa shine combinations for intermediate dancers',
        content: 'Looking to expand my repertoire of salsa shines! I\'m comfortable with basic shines but want to learn some flowing combinations that look impressive but aren\'t too complex.\n\nWhat are your go-to shine sequences? Any YouTube channels or instructors you\'d recommend for learning new combinations?\n\nAlso interested in tips for smooth transitions between different shine patterns!',
        category: 'technique',
        userId: createdUsers[2].id // James
      },
      {
        title: 'Dance shoe recommendations for different styles',
        content: 'Can we start a thread about dance shoes? I\'m looking for recommendations for different dance styles and would love to hear everyone\'s experiences.\n\nWhat I\'m curious about:\n👠 Best brands for salsa/bachata\n👠 Heel height preferences\n👠 Comfort vs style trade-offs\n👠 Budget-friendly options\n👠 How long do your shoes typically last?\n\nLet\'s help each other find the perfect dance shoes!',
        category: 'general',
        userId: createdUsers[3].id // Emma
      },
      {
        title: 'How to find dance events in your city',
        content: 'Moving to a new city and looking for ways to find local dance events, socials, and workshops. What are the best platforms and methods you\'ve used to discover dance opportunities?\n\nSome ideas I\'ve heard about:\n• Facebook groups for dancers\n• Eventbrite searches\n• Studio websites and newsletters\n• Dance community apps\n• Word of mouth from local dancers\n\nWhat works best for you?',
        category: 'events',
        userId: createdUsers[2].id // James
      },
      {
        title: 'Building confidence as a beginner',
        content: 'Started taking dance classes 2 months ago and still feel awkward on the dance floor. Any advice for building confidence and feeling more natural while dancing?\n\nI know it takes time and practice, but wondering if anyone has specific tips that helped them get over that initial self-consciousness.',
        category: 'beginners',
        userId: createdUsers[5].id // Sofia
      },
      {
        title: 'Creating the perfect practice playlist - tempo and energy',
        content: 'I\'ve been experimenting with different playlist structures for practice sessions. Here\'s what I\'ve learned about organizing music for effective practice:\n\n🎵 **Warm-up (slower tempo)**: 120-140 BPM\n🎵 **Technique work (medium tempo)**: 140-160 BPM\n🎵 **High energy practice (faster tempo)**: 160-180 BPM\n🎵 **Cool down (slower again)**: 120-140 BPM\n\nWhat playlist structures work best for you? Any specific songs you always include?',
        category: 'music',
        userId: createdUsers[4].id // Diego
      },
      {
        title: 'Preparing for your first competition - tips and experiences',
        content: 'I\'ve decided to compete in my first amateur salsa competition next month! I\'m both excited and terrified. For those who have competed before, what advice would you give?\n\nWhat I\'m wondering about:\n• How to choose the right routine length\n• Dealing with nerves on competition day\n• What judges typically look for\n• Practice schedule leading up to the event\n• What to wear and performance tips\n\nShare your competition experiences!',
        category: 'events',
        userId: createdUsers[5].id // Sofia
      }
    ]

    // Create posts with realistic view counts and timing
    const createdPosts = []
    for (const postData of samplePosts) {
      const existingPost = await prisma.forumPost.findFirst({
        where: { title: postData.title },
      })

      if (!existingPost) {
        const post = await prisma.forumPost.create({
          data: {
            ...postData,
            viewsCount: Math.floor(Math.random() * 200) + 20, // More realistic view counts
            likesCount: Math.floor(Math.random() * 15) + 1,
            createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random time in last 30 days
          },
        })
        createdPosts.push(post)
        console.log(`✅ Created post: ${postData.title}`)
      }
    }

    // Add diverse sample replies to make the forum feel active
    const sampleReplies = [
      {
        postTitle: 'Welcome to the Dance Community Forum!',
        replies: [
          {
            content: 'Thank you for creating this forum! I\'m excited to be part of this dance community. Looking forward to learning from everyone here.',
            userId: createdUsers[0].id // Maria
          },
          {
            content: 'This is exactly what the dance community needed! Can\'t wait to share tips and learn from everyone.',
            userId: createdUsers[3].id // Emma
          },
          {
            content: 'Welcome everyone! Let\'s make this a supportive space for dancers of all levels. 💃✨',
            userId: createdUsers[4].id // Diego
          }
        ]
      },
      {
        postTitle: 'Best beginner-friendly salsa moves?',
        replies: [
          {
            content: 'Start with the basic step and cross body lead! Those two moves will get you dancing right away. Once you\'re comfortable, try the right turn and left turn. Master these basics before moving on to fancy moves.',
            userId: createdUsers[1].id // Carlos
          },
          {
            content: 'I agree with Carlos! Also practice your timing with different songs. Try counting "1, 2, 3... 5, 6, 7" out loud until it becomes natural.',
            userId: createdUsers[2].id // James
          }
        ]
      },
      {
        postTitle: 'How to overcome dance floor anxiety?',
        replies: [
          {
            content: 'I totally understand this feeling! What helped me was starting by dancing with friends first, then gradually expanding to dancing with new people. Remember, everyone is focused on their own dancing, not judging yours.',
            userId: createdUsers[0].id // Maria
          },
          {
            content: 'Practice makes perfect! The more you dance socially, the more confident you\'ll become. Also, remember that making mistakes is part of learning - even advanced dancers mess up sometimes!',
            userId: createdUsers[1].id // Carlos
          },
          {
            content: 'Try to arrive early to socials when there are fewer people. It\'s less intimidating and you can warm up gradually. Also, focus on enjoying the music rather than worrying about how you look.',
            userId: createdUsers[3].id // Emma
          }
        ]
      },
      {
        postTitle: 'Best Latin music for practicing at home',
        replies: [
          {
            content: 'Here are some of my favorite practice songs:\n\nSalsa:\n- "El Cuarto de Tula" by Buena Vista Social Club\n- "La Negra" by La Santa Cecilia\n- "Quimbara" by Celia Cruz\n\nBachata:\n- "Obsesión" by Aventura\n- "Propuesta Indecente" by Romeo Santos\n- "Darte un Beso" by Prince Royce',
            userId: createdUsers[4].id // Diego
          },
          {
            content: 'Great list Diego! I\'d add "Bamboléo" by Gipsy Kings for salsa - it has such a clear beat. For bachata, "Bachata Rosa" by Juan Luis Guerra is perfect for beginners.',
            userId: createdUsers[1].id // Carlos
          }
        ]
      },
      {
        postTitle: 'Tips for leading vs following in partner dances',
        replies: [
          {
            content: 'Focus on your frame and connection first! A good frame allows for clear communication. Also, remember that leading isn\'t about force - it\'s about clear intention and timing.',
            userId: createdUsers[1].id // Carlos  
          },
          {
            content: 'As a follow, I appreciate when leads give me time to complete moves. Don\'t rush into the next pattern - let the current one finish naturally!',
            userId: createdUsers[0].id // Maria
          }
        ]
      }
    ]

    // Create replies for each post
    for (const replyGroup of sampleReplies) {
      const post = await prisma.forumPost.findFirst({
        where: { title: replyGroup.postTitle }
      })
      
      if (post && replyGroup.replies) {
        for (const replyData of replyGroup.replies) {
          const existingReply = await prisma.forumReply.findFirst({
            where: { 
              postId: post.id,
              content: replyData.content
            }
          })
          
          if (!existingReply) {
            await prisma.forumReply.create({
              data: {
                content: replyData.content,
                postId: post.id,
                userId: replyData.userId,
                likesCount: Math.floor(Math.random() * 8) + 1,
                createdAt: new Date(post.createdAt.getTime() + Math.random() * 24 * 60 * 60 * 1000), // Reply after post
              },
            })
          }
        }
        
        // Update reply count for the post
        const replyCount = await prisma.forumReply.count({
          where: { postId: post.id }
        })
        
        await prisma.forumPost.update({
          where: { id: post.id },
          data: { repliesCount: replyCount },
        })
        
        console.log(`✅ Added ${replyGroup.replies.length} replies to: ${post.title}`)
      }
    }

    console.log('🎉 Forum seeding completed successfully!')
  } catch (error) {
    console.error('Error seeding forum data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedForum()