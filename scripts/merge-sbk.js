const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function mergeSBKStyles() {
  try {
    const salsaId = 'cmfwfuas30000v1fi21n6f4br';
    const bachataId = 'cmfwfub0v0001v1fijc28itdy'; 
    const kizombaId = 'cmfwfub6y0002v1fi3o03da6q';
    
    console.log('🔍 Checking existing relationships...');
    
    // Check existing relationships
    const classStyles = await prisma.classStyle.findMany({
      where: { styleId: { in: [salsaId, bachataId, kizombaId] } }
    });
    
    const eventStyles = await prisma.eventStyle.findMany({
      where: { styleId: { in: [salsaId, bachataId, kizombaId] } }
    });
    
    const userStyles = await prisma.userStyle.findMany({
      where: { styleId: { in: [salsaId, bachataId, kizombaId] } }
    });
    
    const profileStyles = await prisma.userProfileDanceStyle.findMany({
      where: { styleId: { in: [salsaId, bachataId, kizombaId] } }
    });
    
    console.log(`Found relationships: ${classStyles.length} class styles, ${eventStyles.length} event styles, ${userStyles.length} user styles, ${profileStyles.length} profile styles`);
    
    // Step 1: Create new SBK style
    console.log('📝 Creating SBK dance style...');
    const sbkStyle = await prisma.danceStyle.create({
      data: {
        name: 'SBK (Salsa, Bachata, Kizomba)',
        category: 'Latin/African',
        description: 'Combined style covering Salsa, Bachata, and Kizomba dances',
        isActive: true,
        isFeatured: true,
        sortOrder: 1
      }
    });
    
    console.log(`✅ Created SBK style with ID: ${sbkStyle.id}`);
    
    // Step 2: Update all relationships to point to SBK
    console.log('🔄 Updating class styles...');
    for (const classStyle of classStyles) {
      await prisma.classStyle.updateMany({
        where: { 
          classId: classStyle.classId, 
          styleId: { in: [salsaId, bachataId, kizombaId] } 
        },
        data: { styleId: sbkStyle.id }
      });
    }
    
    console.log('🔄 Updating event styles...');
    for (const eventStyle of eventStyles) {
      await prisma.eventStyle.updateMany({
        where: { 
          eventId: eventStyle.eventId, 
          styleId: { in: [salsaId, bachataId, kizombaId] } 
        },
        data: { styleId: sbkStyle.id }
      });
    }
    
    console.log('🔄 Updating user styles...');
    for (const userStyle of userStyles) {
      await prisma.userStyle.updateMany({
        where: { 
          userId: userStyle.userId, 
          styleId: { in: [salsaId, bachataId, kizombaId] } 
        },
        data: { styleId: sbkStyle.id }
      });
    }
    
    console.log('🔄 Updating profile styles...');
    for (const profileStyle of profileStyles) {
      await prisma.userProfileDanceStyle.updateMany({
        where: { 
          profileId: profileStyle.profileId, 
          styleId: { in: [salsaId, bachataId, kizombaId] } 
        },
        data: { styleId: sbkStyle.id }
      });
    }
    
    // Step 3: Deactivate the old styles
    console.log('❌ Deactivating old styles...');
    await prisma.danceStyle.updateMany({
      where: { id: { in: [salsaId, bachataId, kizombaId] } },
      data: { isActive: false }
    });
    
    console.log('✅ Successfully merged Salsa, Bachata, and Kizomba into SBK category!');
    
    // Show final result
    const allStyles = await prisma.danceStyle.findMany({
      select: { id: true, name: true, category: true, isActive: true },
      orderBy: { name: 'asc' }
    });
    
    console.log('\n📋 Updated dance styles:');
    allStyles.forEach(style => {
      console.log(`  ${style.isActive ? '✅' : '❌'} ${style.name} (${style.category})`);
    });
    
  } catch (error) {
    console.error('❌ Error during merge:', error);
  } finally {
    await prisma.$disconnect();
  }
}

mergeSBKStyles();