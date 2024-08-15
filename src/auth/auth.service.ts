import { HttpException, HttpStatus, Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { AdministratorDTO } from "./dto/administrator.dto";
import { PrismaClient as ManagementPrismaClient } from '../../prisma/generated/client/management';
import { PrismaClient as ClientPrismaClient } from '../../prisma/generated/client/client';
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class AuthService extends ManagementPrismaClient implements OnModuleInit {
    private clientConnections: Map<number, ClientPrismaClient> = new Map();

    constructor(
        private readonly databaseService: DatabaseService
    ) {
        super();
    }

    async onModuleInit() {
        await this.$connect();
    }

    async validateAdministrator(administratorDto: AdministratorDTO) {
        const administrator = await this.findAdministratorByEmail(administratorDto.email);

        if (!administrator.company.state) {
            throw new HttpException('Your company is disabled, please re paga la plata', HttpStatus.FORBIDDEN);
        }

        const prisma = await this.getOrCreateClientConnection(administrator.company);

        try {
            const exampleData = await prisma.company.findMany(); // Usa el PrismaClient del cliente
            return {
                data: administrator,
                exampleData
            };
        } catch (error) {
            console.error('Error querying new database:', error);
            throw new HttpException('Error connecting to company database', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findAdministratorByEmail(email: string) {
        const administrator = await this.admin.findUnique({
            where: {
                email,
            },
            include: {
                company: true
            }
        });

        if (!administrator) {
            throw new NotFoundException(`Administrator with email: ${email} not found`);
        }

        return administrator;
    }

    async getOrCreateClientConnection(company: any): Promise<ClientPrismaClient> {
        if (!this.clientConnections.has(company.id)) {
            const newClient = this.createClientForCompany(company);
            await newClient.$connect();
            this.clientConnections.set(company.id, newClient);
        }
        return this.clientConnections.get(company.id);
    }

    createClientForCompany(company: any): ClientPrismaClient {
        const connectionUrl = `postgresql://${company.db_username}:${company.db_password}@${company.db_host}:${company.db_port}/${company.db_name}?schema=${company.schema_name}`;
        console.log(`Connecting to database with URL: ${connectionUrl}`);

        return new ClientPrismaClient({
            datasources: {
                db: {
                    url: connectionUrl,
                },
            },
        });
    }

    async closeAllConnections() {
        for (const client of this.clientConnections.values()) {
            await client.$disconnect();
        }
        this.clientConnections.clear();
    }
}
