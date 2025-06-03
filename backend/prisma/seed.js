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

  // 👤 Create a demo user for sample books
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@bookstore.com' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@bookstore.com',
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj5wz2CdPyMG' // hashed: "demo123"
    }
  });
  console.log(`✅ Created demo user: ${demoUser.email}`);

  // 📚 Sample books data
  const sampleBooks = [
    // Fiction books
    {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      description: 'A classic American novel set in the Jazz Age, exploring themes of wealth, love, idealism, and moral decay.',
      price: 12.99,
      categoryName: 'Fiction'
    },
    {
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      description: 'A gripping tale of racial injustice and childhood innocence in the American South.',
      price: 14.50,
      categoryName: 'Fiction'
    },
    {
      title: '1984',
      author: 'George Orwell',
      description: 'A dystopian social science fiction novel about totalitarian control and surveillance.',
      price: 13.75,
      categoryName: 'Fiction'
    },

    // Technology books
    {
      title: 'Clean Code',
      author: 'Robert C. Martin',
      description: 'A handbook of agile software craftsmanship that teaches you how to write clean, readable code.',
      price: 45.99,
      categoryName: 'Technology'
    },
    {
      title: 'JavaScript: The Good Parts',
      author: 'Douglas Crockford',
      description: 'Unearthing the excellence in JavaScript and showing how to avoid the pitfalls.',
      price: 35.00,
      categoryName: 'Technology'
    },
    {
      title: 'Design Patterns',
      author: 'Gang of Four',
      description: 'Elements of reusable object-oriented software design patterns.',
      price: 55.99,
      categoryName: 'Technology'
    },

    // Business books
    {
      title: 'The Lean Startup',
      author: 'Eric Ries',
      description: 'How constant innovation creates radically successful businesses.',
      price: 28.99,
      categoryName: 'Business'
    },
    {
      title: 'Good to Great',
      author: 'Jim Collins',
      description: 'Why some companies make the leap and others don\'t.',
      price: 32.50,
      categoryName: 'Business'
    },

    // Science books
    {
      title: 'A Brief History of Time',
      author: 'Stephen Hawking',
      description: 'From the Big Bang to black holes, a journey through the universe.',
      price: 18.99,
      categoryName: 'Science'
    },
    {
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      description: 'A brief history of humankind and how we came to dominate the world.',
      price: 22.95,
      categoryName: 'Science'
    },

    // Self-Help books
    {
      title: 'The 7 Habits of Highly Effective People',
      author: 'Stephen R. Covey',
      description: 'Powerful lessons in personal change and leadership.',
      price: 24.99,
      categoryName: 'Self-Help'
    },
    {
      title: 'Atomic Habits',
      author: 'James Clear',
      description: 'An easy and proven way to build good habits and break bad ones.',
      price: 26.50,
      categoryName: 'Self-Help'
    },

    // Non-Fiction books
    {
      title: 'Becoming',
      author: 'Michelle Obama',
      description: 'A memoir by the former First Lady of the United States.',
      price: 29.99,
      categoryName: 'Non-Fiction'
    },
    {
      title: 'Educated',
      author: 'Tara Westover',
      description: 'A memoir about a woman who grows up in a survivalist family and eventually earns a PhD.',
      price: 25.99,
      categoryName: 'Non-Fiction'
    }
  ];

  // 📖 Create sample books
  console.log('📚 Creating sample books...');
  for (const bookData of sampleBooks) {
    // Find the category
    const category = await prisma.category.findUnique({
      where: { name: bookData.categoryName }
    });

    if (category) {
      await prisma.book.upsert({
        where: { 
          title_author: {
            title: bookData.title,
            author: bookData.author
          }
        },
        update: {},
        create: {
          title: bookData.title,
          author: bookData.author,
          description: bookData.description,
          price: bookData.price,
          userId: demoUser.id,
          categoryId: category.id
        }
      });
      console.log(`✅ Created book: ${bookData.title} by ${bookData.author}`);
    }
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
