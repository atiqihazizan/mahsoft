const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('../../utils/auth');
const users = require('../data/users');

const prisma = new PrismaClient();

async function seedUsers() {
  console.log('👥 Seeding users...');
  
  for (const userData of users) {
    try {
      // Hash password
      const hashedPassword = await hashPassword(userData.password);
      
      const userDataWithHashedPassword = {
        ...userData,
        password: hashedPassword,
        isActive: true
      };

      await prisma.user.create({
        data: userDataWithHashedPassword
      });
    } catch (error) {
      if (error.code === 'P2002') {
        console.log(`User ${userData.username} already exists, skipping...`);
      } else {
        throw error;
      }
    }
  }
  
  console.log(`✅ ${users.length} users seeded`);
}

module.exports = seedUsers;
