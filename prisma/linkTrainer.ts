import { config } from 'dotenv';
config({ path: '.env.local' });
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const updated = await prisma.trainer.update({
    where: { id: 11 },
    data: { userId: 'cmqt9tfa00000od99pfsmapa0' },
  });
  console.log('Linked:', updated.name, '→', updated.userId);
}
main().catch(console.error).finally(() => prisma.$disconnect());
