import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient({});

async function main() {
    const password = 'Password123!';
    const hash = await bcrypt.hash(password, 10);

    // create admin
    await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            passwordHash: hash,
            name: 'Administrator',
            role: 'ADMIN'
        }
    });

    // sample clients
    await prisma.client.upsert({
        where: { id: 'c_1' },
        update: {},
        create: {
            id: 'c_1',
            name: 'Acme Corporation',
            email: 'contact@acme.example',
            data: {}
        }
    });

    await prisma.client.upsert({
        where: { id: 'c_2' },
        update: {},
        create: {
            id: 'c_2',
            name: 'Beta LLC',
            email: 'hello@beta.example',
            data: {}
        }
    });

    console.log('Seed complete. Admin user: admin@example.com / Password123!');
}

main()
    // eslint-disable-next-line no-undef
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => {
        await prisma.$disconnect();
    });