
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@example.com';
  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    const hashed = await bcrypt.hash('Admin@123', 10);
    await prisma.user.create({ data: { name: 'Admin', email, password: hashed, role: 'admin' } });
    console.log('Seeded admin:', email, 'password: Admin@123');
  } else {
    console.log('Admin already exists');
  }
}

main().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
