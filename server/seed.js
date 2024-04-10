const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

// Define your user data
const userData = [
  {
    username: 'johndoe',
    email: 'john@example.com',
    password: 'password123', 
  },
  {
    username: 'janedoe',
    email: 'jane@example.com',
    password: 'password456',
  },
];

// Define your item data
const itemData = [
  {
    name: 'Item 1',
    description: 'Description for Item 1',
    category: 'Category 1',
  },
  {
    name: 'Item 2',
    description: 'Description for Item 2',
    category: 'Category 2',
  },
];

// Define your review data
const reviewData = [
  {
    review: 'Great product, highly recommend!',
    rating: 5,
  },
  {
    review: 'Did not meet my expectations.',
    rating: 2,
  },
];

// Define your comment data
// Note: The userId and reviewId will be assigned dynamically based on created users and reviews
const commentData = [
  {
    comment: 'Thanks for the recommendation!',
  },
  {
    comment: 'Sorry to hear that. Did you contact customer support?',
  },
];

async function main() {
  console.log(`Start seeding ...`);

  // Seed users
  const users = [];
  for (const u of userData) {
    const hashedPassword = await bcrypt.hash(u.password, 10); 
    const user = await prisma.user.create({
      data: {
        ...u,
        password: hashedPassword, // Use the hashed password
      },
    });
    users.push(user);
    console.log(`Created user with id: ${user.id}`);
  }

  // Seed items
  const items = [];
  for (const item of itemData) {
    const createdItem = await prisma.item.create({
      data: item,
    });
    items.push(createdItem);
    console.log(`Created item with id: ${createdItem.id}`);
  }

  // Seed reviews and collect created reviews
  const reviews = [];
  for (let i = 0; i < reviewData.length; i++) {
    const review = await prisma.review.create({
      data: {
        ...reviewData[i],
        userId: users[i % users.length].id, 
        itemId: items[i % items.length].id, 
      },
    });
    reviews.push(review);
    console.log(`Created review for user ${users[i % users.length].username} on item ${items[i % items.length].name}`);
  }

  // Seed comments
  for (let i = 0; i < commentData.length; i++) {
    await prisma.comment.create({
      data: {
        ...commentData[i],
        userId: users[i % users.length].id, // Cycle through users
        reviewId: reviews[i % reviews.length].id, // Associate with reviews
      },
    });
    console.log(`Created comment for review ${reviews[i % reviews.length].id}`);
  }

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
