import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
    user: {
        id: number;
        // Puedes agregar más propiedades que estén en `user`, como email, roles, etc.
    };
}
