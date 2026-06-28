import { config } from 'dotenv';
config({ path: '.env.local' });
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const trainers = await prisma.trainer.findMany();
  const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true } });
  console.log('Trainers:', JSON.stringify(trainers.map(t => ({ id: t.id, name: t.name, userId: t.userId })), null, 2));
  console.log('Users:', JSON.stringify(users, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
