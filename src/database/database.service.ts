import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import { envs } from 'src/config/envs';

const execPromise = promisify(exec);

@Injectable()
export class DatabaseService implements OnModuleDestroy, OnModuleInit {
    private prismaClient: any; // Usa `any` ya que el tipo es dinámico

    async onModuleInit() {
        // Aquí puedes inicializar el servicio o realizar tareas previas
    }

    async switchDatabase(companyData: any) {
        if (this.prismaClient) {
            await this.prismaClient.$disconnect();
        }

        // Configura la URL de conexión con los datos de la compañía
        const connectionUrl = `postgresql://${companyData.db_username}:${companyData.db_password}@${companyData.db_host}:${companyData.db_port}/${companyData.db_name}?schema=${companyData.schema_name}`;

        // Verifica la conexión a la nueva base de datos
        try {
            const PrismaClient = await this.loadPrismaClient();
            this.prismaClient = new PrismaClient({
                datasources: {
                    db: {
                        url: connectionUrl,
                    },
                },
            });

            await this.prismaClient.$connect();
            console.log('Connected to the new database successfully.');

            // Actualiza la variable de entorno
            envs.CLIENT_DB_URL = connectionUrl;
            console.log(`Connection URL: ${connectionUrl}`);

            // Genera el cliente Prisma después de validar la conexión
            await this.generateClient();

        } catch (error) {
            console.error('Failed to connect to the new database:', error);
            throw new Error('Database connection error');
        }
    }

    async generateClient() {
        try {
            console.log(`variable `, envs.CLIENT_DB_URL);

            // Ejecuta el comando `prisma generate` para generar el cliente
            await execPromise('npx prisma generate --schema=prisma/client.prisma');
            console.log('Prisma Client generated successfully.');
        } catch (error) {
            console.error('Failed to generate Prisma Client:', error);
            throw new Error('Prisma Client generation error');
        }
    }

    private async loadPrismaClient(): Promise<any> {
        try {
            // Cargar el cliente Prisma dinámicamente
            const prismaModule = await import('../../prisma/generated/client/client');
            return prismaModule.PrismaClient;
        } catch (error) {
            console.error('Failed to load Prisma Client:', error);
            throw new Error('Prisma Client loading error');
        }
    }

    getPrismaClient() {
        if (!this.prismaClient) {
            throw new Error('Database client is not initialized');
        }
        return this.prismaClient;
    }

    async onModuleDestroy() {
        if (this.prismaClient) {
            await this.prismaClient.$disconnect();
        }
    }
}
