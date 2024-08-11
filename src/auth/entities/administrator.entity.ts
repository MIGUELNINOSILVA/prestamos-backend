export class AdministratorEntity {
    id: number
    company_id: number;
    email: string;
    password: string;
    role?: string;
    created_at?: Date;
    updated_at?: Date;
}