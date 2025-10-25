const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addBallroomLatinStyles() {
  try {
    console.log('📝 Adding Ballroom and Latin dance categories...');
    
    // Check existing styles first
    const existingStyles = await prisma.danceStyle.findMany({
      select: { name: true, category: true, isActive: true }
    });
    
    console.log('\n🔍 Current active styles:');
    existingStyles.filter(s => s.isActive).forEach(style => {
      console.log(`  - ${style.name} (${style.category})`);
    });
    
    // Define new dance styles to add
    const newStyles = [
      {
        name: 'Ballroom',
        category: 'Ballroom',
        description: 'Traditional ballroom dancing including waltz, foxtrot, and quickstep',
        isActive: true,
        isFeatured: true,
        sortOrder: 10
      },
      {
        name: 'Latin',
        category: 'Latin',
        description: 'Latin dance styles including various Latin American dances',
        isActive: true,
        isFeatured: true,
        sortOrder: 11
      }
    ];
    
    // Check if styles already exist
    for (const style of newStyles) {
      const existing = existingStyles.find(s => 
        s.name.toLowerCase() === style.name.toLowerCase()
      );
      
      if (existing) {
        console.log(`⚠️  ${style.name} already exists (${existing.isActive ? 'active' : 'inactive'})`);
        if (!existing.isActive) {
          console.log(`🔄 Reactivating ${style.name}...`);
          await prisma.danceStyle.updateMany({
            where: { name: { equals: style.name, mode: 'insensitive' } },
            data: { 
              isActive: true,
              category: style.category,
              description: style.description,
              isFeatured: style.isFeatured,
              sortOrder: style.sortOrder
            }
          });
          console.log(`✅ Reactivated ${style.name}`);
        }
      } else {
        console.log(`➕ Creating new ${style.name} dance style...`);
        const created = await prisma.danceStyle.create({
          data: style
        });
        console.log(`✅ Created ${style.name} with ID: ${created.id}`);
      }
    }
    
    console.log('\n✅ Successfully added Ballroom and Latin categories!');
    
    // Show final result
    const allStyles = await prisma.danceStyle.findMany({
      select: { id: true, name: true, category: true, isActive: true, sortOrder: true },
      orderBy: [
        { isActive: 'desc' },
        { sortOrder: 'asc' },
        { name: 'asc' }
      ]
    });
    
    console.log('\n📋 Updated dance styles list:');
    const activeStyles = allStyles.filter(s => s.isActive);
    const inactiveStyles = allStyles.filter(s => !s.isActive);
    
    console.log('\n🟢 ACTIVE STYLES:');
    activeStyles.forEach((style, index) => {
      console.log(`  ${(index + 1).toString().padStart(2)}. ${style.name.padEnd(30)} (${style.category})`);
    });
    
    if (inactiveStyles.length > 0) {
      console.log('\n🔴 INACTIVE STYLES:');
      inactiveStyles.forEach((style, index) => {
        console.log(`  ${(index + 1).toString().padStart(2)}. ${style.name.padEnd(30)} (${style.category})`);
      });
    }
    
    console.log(`\n📊 Summary: ${activeStyles.length} active styles, ${inactiveStyles.length} inactive styles`);
    
  } catch (error) {
    console.error('❌ Error adding styles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addBallroomLatinStyles();