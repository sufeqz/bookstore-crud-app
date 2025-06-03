// 🌱 Database Seed Script
// Adds default categories to get started

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 🏷️ Create default categories
  const categories = [
    {
      name: 'Fiction',
      description: 'Novels, short stories, and other fictional works'
    },
    {
      name: 'Non-Fiction',
      description: 'Biographies, essays, and factual books'
    },
    {
      name: 'Technology',
      description: 'Programming, tech guides, and computer science books'
    },
    {
      name: 'Business',
      description: 'Business strategy, entrepreneurship, and finance books'
    },
    {
      name: 'Science',
      description: 'Scientific research, discoveries, and educational content'
    },
    {
      name: 'Self-Help',
      description: 'Personal development and improvement books'
    }
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category
    });
    console.log(`✅ Created category: ${category.name}`);
  }

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
