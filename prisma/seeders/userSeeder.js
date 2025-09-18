const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('../../utils/auth');
const users = require('../data/users');

const prisma = new PrismaClient();

async function seedUsers() {
  console.log('👥 Seeding users...');
  
  for (const userData of users) {
    // Hash password
    const hashedPassword = await hashPassword(userData.password);
    
    const userDataWithHashedPassword = {
      ...userData,
      password: hashedPassword,
      isActive: true // Explicitly set isActive to true
    };

    // Use upsert to handle existing users
    await prisma.user.upsert({
      where: { username: userData.username },
      update: userDataWithHashedPassword,
      create: userDataWithHashedPassword
    });
  }
  
  console.log(`✅ ${users.length} users seeded`);
}

module.exports = seedUsers;
