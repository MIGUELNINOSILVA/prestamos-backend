import { HttpException, HttpStatus, Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { AdministratorDTO } from "./dto/administrator.dto";
import { PrismaClient as ManagementPrismaClient, PrismaClient } from '../../prisma/generated/client/management';
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class AuthService extends ManagementPrismaClient implements OnModuleInit {

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
        await this.databaseService.switchDatabase(administrator.company);
        // Usa el cliente actualizado para realizar operaciones
        const prisma = this.databaseService.getPrismaClient();
        // Verifica el esquema con una consulta simple
        try {
            const exampleData = await prisma.company.findMany();
            return exampleData;
        } catch (error) {
            console.error('Error querying new database:', error);
        }

        return {
            data: administrator
        };

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

    //Create client for company
    createClientForCompany(company: any): PrismaClient {
        // Crea una nueva instancia de PrismaClient con los datos de conexión
        const prisma = new PrismaClient({
            datasources: {
                db: {
                    url: `postgresql://${company.db_username}:${company.db_password}@localhost:5432/${company.schema_name}`,
                },
            },
        });
        return prisma;
    }

}