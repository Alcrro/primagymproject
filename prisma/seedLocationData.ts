import { config } from 'dotenv';
config({ path: '.env.local' });
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const updated = await prisma.location.update({
    where: { slug: 'satu-mare' },
    data: {
      city: 'Satu Mare',
      county: 'Satu Mare',
      postalCode: '440055',
      address: 'Strada Careiului, nr. 11',
      phone: '+40 744 000 000',
      email: 'contact@primagym.ro',
      lat: 47.7991836,
      lng: 22.8738521,
      amenities: ['Vestiare', 'Dușuri', 'Parcare gratuită', 'WiFi', 'Aer condiționat', 'Saună'],
      schedule: [
        { days: 'Luni–Vineri', open: '08:00', close: '22:00' },
        { days: 'Sâmbătă',     open: '08:00', close: '13:00' },
        { days: 'Duminică',    open: null,     close: null    },
      ],
    },
  });
  console.log('Updated:', updated.name, updated.city);
}
main().catch(console.error).finally(() => prisma.$disconnect());
