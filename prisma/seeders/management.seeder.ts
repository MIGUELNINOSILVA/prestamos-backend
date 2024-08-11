import { PrismaClient as ManagementPrismaClient } from '../generated/client/management'; // Ajusta la ruta si es necesario

const prisma = new ManagementPrismaClient();

async function main() {
    // Insertar datos de prueba
    await prisma.admin.deleteMany({});
    await prisma.company.deleteMany({});
    const company = await prisma.company.create({
        data: {
            name: 'Test Company',
            schema_name: 'cliente_1',
            db_name: 'tenant_prestamos',
            db_host: 'localhost',
            db_port: '5432',
            db_username: 'root',
            db_password: '3152108124',
            state: true,
            identifier: 'test_identifier',
            admins: {
                create: [
                    {
                        name: 'Admin One',
                        email: 'admin1@example.com',
                        password: 'password123',
                        role: 'admin',
                    },
                    {
                        name: 'Admin Two',
                        email: 'admin2@example.com',
                        password: 'password456',
                        role: 'user',
                    },
                ],
            },
        },
    });

    console.log('Company created:', company);
}

main()
    .catch(e => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
